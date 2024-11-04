from PIL import Image, ImageDraw, ImageFont
import cv2
import numpy as np
import platform
import os

def get_font(font_size=150):
    try:
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        font_path = os.path.join(base_dir, "assets", "fonts", "ARIAL.TTF")
        
        return ImageFont.truetype(font_path, font_size)
    except Exception as e:
        print("Font loading error:", e)
        return ImageFont.load_default()

def add_watermark(
    image: np.ndarray,  
    watermark_text="Copyright",
    font_size=150,
    font_color=(255, 255, 255, 80),
    angle=-45
) -> np.ndarray:
    try:
    
        img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGBA))
        
        
        txt_overlay = Image.new('RGBA', img.size, (255, 255, 255, 0))
        
        
        draw = ImageDraw.Draw(txt_overlay)
        
    
        font = get_font(font_size)

        
        left, top, right, bottom = draw.textbbox((0, 0), watermark_text, font=font)
        text_width = right - left
        text_height = bottom - top
      
        x = (img.width - text_width) // 2
        y = (img.height - text_height) // 2
        
      
        draw.text((x, y), watermark_text, font=font, fill=font_color)
        
        txt_overlay = txt_overlay.rotate(angle, expand=True)
        
        new_x = (img.width - txt_overlay.width) // 2
        new_y = (img.height - txt_overlay.height) // 2
        
        watermarked_img = Image.new('RGBA', img.size, (0, 0, 0, 0))
        watermarked_img.paste(img, (0, 0))
        watermarked_img.paste(txt_overlay, (new_x, new_y), txt_overlay)
        
        watermarked_np = cv2.cvtColor(np.array(watermarked_img), cv2.COLOR_RGBA2BGR)
        return watermarked_np

    except Exception as e:
        print("Error adding watermark:", e)
        return image