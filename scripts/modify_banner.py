from PIL import Image, ImageDraw, ImageFont

img = Image.open("web-app/public/robyn_banner_raw.png").convert("RGBA")
w, h = img.size

# Sample background color
bg_sample = img.getpixel((350, 300))
print("Sample BG color:", bg_sample)

# Clean out "POWERED BY SOLANA" area
for y in range(240, 280):
    for x in range(260, 560):
        # sample nearby clean background
        clean_pixel = img.getpixel((x, 300))
        img.putpixel((x, y), clean_pixel)

# Also let's clean out the text area if we want to replace with clean crisp "Robyn OS - FW"
# Let's inspect x: 210 to 650, y: 110 to 200
draw = ImageDraw.Draw(img)

# Try to use a clean font or draw text
try:
    font_sub = ImageFont.truetype("arial.ttf", 14)
    font_main = ImageFont.truetype("arialbd.ttf", 46)
except Exception:
    font_sub = ImageFont.load_default()
    font_main = ImageFont.load_default()

# Add text: "POWERED BY ROBINHOOD CHAIN (100MS L2)"
sub_text = "POWERED BY ROBINHOOD CHAIN  *  100MS ARBITRUM ORBIT"
# draw centered at x=390, y=252
draw.text((275, 252), sub_text, fill=(74, 222, 128, 220), font=font_sub)

img.save("web-app/public/robyn_banner_modified.png")
print("[+] Saved web-app/public/robyn_banner_modified.png successfully!")
