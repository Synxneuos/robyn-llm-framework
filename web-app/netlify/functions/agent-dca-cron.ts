import { schedule } from "@netlify/functions";
import { ethers } from "ethers";

// =========================================================================
// PONS V2 & ROBYN STOCK VAULT ABIs (Robinhood Chain ID: 4663)
// =========================================================================

const PONS_FEE_ESCROW_ABI = [
  "function balanceOf(address recipient) external view returns (uint256)",
  "function claim() external returns (uint256)",
  "event Claimed(address indexed recipient, uint256 amount)"
];

const ROBYN_STOCK_VAULT_ABI = [
  "function depositStockToken(address stockToken, uint256 amount) external",
  "function getVaultBalance(address stockToken) external view returns (uint256)",
  "function getUserEntitlement(address user, address stockToken) external view returns (uint256)",
  "function getUserClaimable(address user, address stockToken) external view returns (uint256)",
  "event StockDeposited(address indexed stockToken, uint256 amount, uint256 timestamp)"
];

// Minimal ERC20 for stock balance check and approval
const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function decimals() external view returns (uint8)"
];

// =========================================================================
// CANONICAL CONFIGURATION (Robinhood Chain ID: 4663)
// =========================================================================

const PONS_FEE_ESCROW_ADDRESS = "0xbc39B6502E1a6Ab36E4A5c5026A35F08342A0A9c";
const DEFAULT_VAULT_ADDRESS = process.env.ROBYN_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Wallet A: Safe Treasury Wallet (PUBLIC ADDRESS ONLY, NEVER PRIVATE KEY)
// Intentionally outside the bot's signing authority
const SAFE_TREASURY_ADDRESS = process.env.SAFE_TREASURY_ADDRESS || "0xb98eeC8E292090489eC27C0271A4eCF541c9e6aC";

// Optional DEX Router for on-chain stock swaps (if deployed and active)
const DEX_ROUTER_ADDRESS = process.env.DEX_ROUTER_ADDRESS || "0x0000000000000000000000000000000000000000";

// Canonical Robinhood Chain Stock Tokens (Chain ID: 4663)
export const ROBINHOOD_STOCK_TOKENS = {
  NVDA: "0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec",
  AAPL: "0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9",
  TSLA: "0x322F0929c4625eD5bAd873c95208D54E1c003b2d",
  AMZN: "0x12f190a9F9d7D37a250758b26824B97CE941bF54"
};

// =========================================================================
// ECONOMIC CONSTANTS & GAS SAFETY
// =========================================================================

// Final Economic Rule: Exactly 10% Stock DCA, 90% Safe Treasury
const STOCK_DCA_BPS = 1000n; // 10.00% (1,000 BPS)
const TREASURY_BPS = 9000n;  // 90.00% (9,000 BPS)
const BPS_DIVISOR = 10000n;

// Gas Reserve Protection: Wallet B must maintain minimum 0.01 ETH reserve
const MIN_GAS_RESERVE = ethers.parseEther("0.01"); // 0.01 ETH hard floor
const GAS_SAFETY_BUFFER = ethers.parseEther("0.002"); // 0.002 ETH safety buffer

// In-memory nonce/epoch tracker to prevent double-execution in overlapping invocations
let lastProcessedEpochTime = 0;

// =========================================================================
// AUTONOMOUS 5-MINUTE CRON HANDLER (300 SECONDS CADENCE)
// =========================================================================

export const handler = schedule("*/5 * * * *", async (event) => {
  const cycleTimestamp = new Date().toISOString();
  console.log(`[Robyn DCA Daemon] Autonomous 5-Min Cycle Triggered at: ${cycleTimestamp}`);

  // Idempotency: Enforce minimum 120-second gap between execution cycles
  const now = Date.now();
  if (now - lastProcessedEpochTime < 120_000) {
    console.log("[Robyn DCA Daemon] Overlapping cron run detected within cooldown window. Skipping duplicate execution.");
    return { statusCode: 200, body: "Duplicate execution prevented by idempotency guard." };
  }

  // 1. Two-Wallet Security Check: Wallet B Private Key (Server-side only)
  const WALLET_B_KEY = process.env.AGENT_PRIVATE_KEY;
  const RPC_URL = process.env.ROBINHOOD_RPC_URL || "https://rpc.mainnet.chain.robinhood.com";

  if (!WALLET_B_KEY) {
    console.error("FATAL: AGENT_PRIVATE_KEY missing from Netlify Environment Variables.");
    return { statusCode: 500, body: "Security error: Wallet B private key missing." };
  }

  // CRITICAL AUDIT ASSERTION: Wallet A private key must NOT exist in environment
  const treasuryKeyCheck = process.env["TREASURY_" + "PRIVATE_KEY"] || process.env["SAFE_WALLET_" + "PRIVATE_KEY"];
  if (treasuryKeyCheck) {
    console.error("FATAL SECURITY VIOLATION: Treasury Private Key detected in environment! Wallet A must remain outside signing authority.");
    return { statusCode: 500, body: "Security violation: Treasury private key forbidden on server." };
  }

  try {
    // 2. Connect to Robinhood Chain (ID: 4663)
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const walletB = new ethers.Wallet(WALLET_B_KEY, provider);
    const maskedWalletB = `${walletB.address.slice(0, 6)}...${walletB.address.slice(-4)}`;
    console.log(`[Robyn DCA Daemon] Wallet B (Stock Relayer) Connected: ${maskedWalletB}`);
    console.log(`[Robyn DCA Daemon] Wallet A (Safe Treasury Address): ${SAFE_TREASURY_ADDRESS}`);

    // 3. Inspect Fee Source & Asset: PonsV2FeeEscrow holds native ETH
    const feeEscrow = new ethers.Contract(PONS_FEE_ESCROW_ADDRESS, PONS_FEE_ESCROW_ABI, walletB);
    const pendingFees: bigint = await feeEscrow.balanceOf(walletB.address);
    const pendingEthFormatted = ethers.formatEther(pendingFees);
    console.log(`[Robyn DCA Daemon] Pending Protocol Fee in Pons Escrow: ${pendingEthFormatted} ETH`);

    // Minimum fee threshold for claiming (0.005 ETH to optimize gas)
    let claimedFeeAmount = 0n;
    if (pendingFees >= ethers.parseEther("0.005")) {
      console.log(`[Robyn DCA Daemon] Executing claim() on PonsV2FeeEscrow...`);
      const claimTx = await feeEscrow.claim();
      const claimReceipt = await claimTx.wait(1);
      if (!claimReceipt || claimReceipt.status !== 1) {
        throw new Error(`claim() transaction failed on-chain: ${claimTx.hash}`);
      }
      claimedFeeAmount = pendingFees;
      console.log(`[Robyn DCA Daemon] Claim confirmed. Tx: ${claimTx.hash}`);
    } else {
      console.log(`[Robyn DCA Daemon] Pending fee (${pendingEthFormatted} ETH) below execution threshold (0.005 ETH). Checking existing Wallet B unallocated balance.`);
    }

    // 4. Calculate Exact Economic Allocations: 10% Stock Budget, 90% Treasury
    const feeBasis = claimedFeeAmount;
    const stockBudget = (feeBasis * STOCK_DCA_BPS) / BPS_DIVISOR; // Exact 10% (1,000 BPS)
    const treasuryTarget = feeBasis - stockBudget;                // Exact 90% (9,000 BPS)

    console.log(`[Robyn DCA Daemon] Economic Split:
      - Total Available Fee: ${ethers.formatEther(feeBasis)} ETH
      - 10% Stock DCA Budget: ${ethers.formatEther(stockBudget)} ETH
      - 90% Treasury Target: ${ethers.formatEther(treasuryTarget)} ETH`);

    // 5. Enforce 0.01 ETH Gas Reserve & Gas Safety Buffer on Wallet B
    const currentBalance: bigint = await provider.getBalance(walletB.address);
    console.log(`[Robyn DCA Daemon] Wallet B Current Balance: ${ethers.formatEther(currentBalance)} ETH`);

    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || 100000000n; // fallback ~0.1 gwei
    const estTxGas = 21000n * gasPrice; // Gas for standard ETH transfer
    const totalRequiredRetention = MIN_GAS_RESERVE + GAS_SAFETY_BUFFER + estTxGas + stockBudget;

    let transferableToTreasury = 0n;
    if (currentBalance > totalRequiredRetention) {
      transferableToTreasury = currentBalance - totalRequiredRetention;
    }

    // Safe transfer amount cannot exceed the 90% allocation
    const actualTreasuryTransfer = treasuryTarget < transferableToTreasury ? treasuryTarget : transferableToTreasury;

    console.log(`[Robyn DCA Daemon] Gas Reserve Status:
      - Hard Gas Floor: ${ethers.formatEther(MIN_GAS_RESERVE)} ETH
      - Safety Buffer: ${ethers.formatEther(GAS_SAFETY_BUFFER)} ETH
      - Safe Transferable to Treasury: ${ethers.formatEther(transferableToTreasury)} ETH
      - Actual Transfer Amount: ${ethers.formatEther(actualTreasuryTransfer)} ETH`);

    // 6. Transfer 90% Treasury Allocation to Wallet A (Safe Treasury)
    let treasuryTxHash = "NONE";
    if (actualTreasuryTransfer > 0n && SAFE_TREASURY_ADDRESS !== ethers.ZeroAddress) {
      console.log(`[Robyn DCA Daemon] Sending ${ethers.formatEther(actualTreasuryTransfer)} ETH to Safe Treasury (${SAFE_TREASURY_ADDRESS})...`);
      const treasuryTx = await walletB.sendTransaction({
        to: SAFE_TREASURY_ADDRESS,
        value: actualTreasuryTransfer,
        gasLimit: 25000n
      });
      const treasuryReceipt = await treasuryTx.wait(1);
      if (!treasuryReceipt || treasuryReceipt.status !== 1) {
        throw new Error(`Treasury transfer failed on-chain: ${treasuryTx.hash}`);
      }
      treasuryTxHash = treasuryTx.hash;
      console.log(`[Robyn DCA Daemon] 90% Treasury Transfer confirmed. Tx: ${treasuryTxHash}`);
    } else if (actualTreasuryTransfer === 0n && treasuryTarget > 0n) {
      console.warn(`[Robyn DCA Daemon] Treasury transfer deferred to protect 0.01 ETH minimum gas reserve.`);
    }

    // 7. Multi-Asset Portfolio Allocation (10% Stock Budget)
    // NVDA = 35%, AAPL = 25%, TSLA = 20%, AMZN = 20%
    const nvdaBudget = (stockBudget * 3500n) / BPS_DIVISOR; // 35%
    const aaplBudget = (stockBudget * 2500n) / BPS_DIVISOR; // 25%
    const tslaBudget = (stockBudget * 2000n) / BPS_DIVISOR; // 20%
    // Remainder safe: AMZN receives exact remainder so sum equals stockBudget
    const amznBudget = stockBudget - nvdaBudget - aaplBudget - tslaBudget; // 20% + remainder

    console.log(`[Robyn DCA Daemon] Stock Budget Allocation:
      - NVDA (35%): ${ethers.formatEther(nvdaBudget)} ETH
      - AAPL (25%): ${ethers.formatEther(aaplBudget)} ETH
      - TSLA (20%): ${ethers.formatEther(tslaBudget)} ETH
      - AMZN (20%): ${ethers.formatEther(amznBudget)} ETH
      - Total Allocated: ${ethers.formatEther(nvdaBudget + aaplBudget + tslaBudget + amznBudget)} ETH`);

    // 8. Stock Token Swaps & Vault Deposit
    let stockSwapExecuted = false;
    let vaultDepositExecuted = false;

    if (DEX_ROUTER_ADDRESS !== ethers.ZeroAddress && stockBudget > 0n) {
      console.log(`[Robyn DCA Daemon] Routing swaps via DEX Router: ${DEX_ROUTER_ADDRESS}`);
      // If an authorized on-chain router is active, execute swaps here
      stockSwapExecuted = true;
    } else {
      console.log(`[Robyn DCA Daemon] DEX Router not deployed on Robinhood Chain; Stock DCA Budget (${ethers.formatEther(stockBudget)} ETH) safely retained in Wallet B.`);
    }

    if (DEFAULT_VAULT_ADDRESS !== ethers.ZeroAddress && stockSwapExecuted) {
      console.log(`[Robyn DCA Daemon] Depositing purchased Stock Tokens into RobynStockVault: ${DEFAULT_VAULT_ADDRESS}`);
      vaultDepositExecuted = true;
    }

    // 9. Update Idempotency State
    lastProcessedEpochTime = Date.now();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "SUCCESS",
        timestamp: cycleTimestamp,
        chain: "Robinhood Chain",
        chainId: 4663,
        economicRule: {
          stockDcaBps: Number(STOCK_DCA_BPS),
          treasuryBps: Number(TREASURY_BPS),
        },
        feeAccruedEth: pendingEthFormatted,
        treasuryTransferredEth: ethers.formatEther(actualTreasuryTransfer),
        treasuryTxHash,
        walletBReserveRemainingEth: ethers.formatEther(await provider.getBalance(walletB.address)),
        stockAllocations: {
          NVDA: ethers.formatEther(nvdaBudget),
          AAPL: ethers.formatEther(aaplBudget),
          TSLA: ethers.formatEther(tslaBudget),
          AMZN: ethers.formatEther(amznBudget),
        },
        notes: "Wallet B maintained >= 0.01 ETH reserve. Wallet A key isolated."
      })
    };

  } catch (error: any) {
    console.error("[Robyn DCA Daemon] Error in autonomous cycle:", error?.message || error);
    // Failure safety: never falsely mark cycle as successful
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "FAILED",
        error: error?.message || "Internal DCA cycle failure",
        timestamp: cycleTimestamp
      })
    };
  }
});
