// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title RobynTradeProofOracle
 * @dev On-Chain Verifiable Decision & Action Receipt Registry.
 * Anchors cryptographic proofs (intent hash, model parameters, slippage, trade payload)
 * directly into Robinhood Chain blocks for institutional auditability.
 */

contract RobynTradeProofOracle {
    address public immutable owner;

    struct ActionProof {
        bytes32 decisionRoot;      // SHA-256 hash of (Prompt + Model Weights Version + Intent)
        bytes32 executionPayload;  // Hash of raw EVM calldata
        uint256 blockNumber;
        uint256 timestamp;
        string actionType;         // e.g., "AUTONOMOUS_HEDGE", "HYPER_SWAP", "CLM_REBALANCE"
        address targetContract;
    }

    mapping(bytes32 => ActionProof) public proofs;
    uint256 public totalProofsLogged;

    event ProofRecorded(bytes32 indexed proofId, string actionType, address indexed targetContract, uint256 blockNumber);

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Records an immutable cryptographic receipt for an autonomous agent action.
     */
    function recordProof(
        bytes32 proofId,
        bytes32 decisionRoot,
        bytes32 executionPayload,
        string calldata actionType,
        address targetContract
    ) external onlyOwner {
        require(proofs[proofId].timestamp == 0, "Proof already exists");

        proofs[proofId] = ActionProof({
            decisionRoot: decisionRoot,
            executionPayload: executionPayload,
            blockNumber: block.number,
            timestamp: block.timestamp,
            actionType: actionType,
            targetContract: targetContract
        });

        totalProofsLogged++;
        emit ProofRecorded(proofId, actionType, targetContract, block.number);
    }

    function verifyProof(bytes32 proofId) external view returns (bool isValid, string memory actionType, uint256 timestamp) {
        ActionProof memory p = proofs[proofId];
        return (p.timestamp != 0, p.actionType, p.timestamp);
    }
}
