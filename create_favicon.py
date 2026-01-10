#!/usr/bin/env python3
"""
Script to create favicon.ico with the '車' character
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_favicon():
    # Create icons in larger sizes
    sizes = [32, 48, 64, 128]
    images = []

    for size in sizes:
        # Render at ultra-high resolution and then convert to 1-bit image (complete removal of blurring)
        high_res_multiplier = 32  # Render at 32x resolution
        high_res_size = size * high_res_multiplier

        # Create high-resolution image (RGB mode with white background)
        high_res_img = Image.new('RGB', (high_res_size, high_res_size), (255, 255, 255))
        high_res_draw = ImageDraw.Draw(high_res_img)

        # Adjust font size (high-resolution version)
        font_size = int(high_res_size * 0.75)  # 75% size for appropriate margin

        # Use the same font as main.py
        font = None
        font_paths = [
            "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
        ]
        
        for font_path in font_paths:
            try:
                font = ImageFont.truetype(font_path, font_size)
                break
            except IOError:
                continue
        if font is None:
            font = ImageFont.load_default()

        # Adjust text position to center (high-resolution version)
        text = "車"
        # textbbox considers font baseline, adjust for more accurate centering
        bbox = high_res_draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x = (high_res_size - text_width) / 2 - bbox[0]  # Subtract bbox[0] to adjust left edge
        y = (high_res_size - text_height) / 2 - bbox[1]  # Subtract bbox[1] to adjust top edge

        high_res_draw.text((x, y), text, font=font, fill=(0, 0, 0))

        # Convert to 1-bit image to completely remove anti-aliasing
        # Set threshold to force gray pixels to white or black
        high_res_img_1bit = high_res_img.convert('L').point(lambda p: 0 if p < 128 else 255, mode='1')

        # Resize to final size (pixel-perfect reduction with NEAREST)
        img = high_res_img_1bit.resize((size, size), Image.Resampling.NEAREST)

        # ICO format expects RGB or RGBA, so convert to RGB again
        images.append(img.convert('RGB'))

    # Save as ICO file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "textdrive-react/public/favicon.ico")
    images[0].save(output_path, format='ICO', sizes=[(img.width, img.height) for img in images])
    print(f"Favicon created: {output_path}")

if __name__ == "__main__":
    create_favicon()
