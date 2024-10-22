from fastapi import UploadFile
import cv2
import numpy as np
from io import BytesIO

class ColorEnhancementService:
    @staticmethod
    async def enhance_color(image_file: UploadFile, color: tuple, enhancement_factor: float = 1.5):
        # Read image from UploadFile
        contents = await image_file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert to HSV
        hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        hsv_color = cv2.cvtColor(np.uint8([[color]]), cv2.COLOR_BGR2HSV)[0][0]

        # Create color mask
        lower_bound = np.array([max(0, hsv_color[0] - 10), 50, 50])
        upper_bound = np.array([min(179, hsv_color[0] + 10), 255, 255])
        mask = cv2.inRange(hsv_image, lower_bound, upper_bound)

        # Enhance color
        hsv_image[:, :, 1] = np.where(mask == 255, 
                                     np.minimum(hsv_image[:, :, 1] * enhancement_factor, 255),
                                     hsv_image[:, :, 1])

        # Convert back to BGR and return
        enhanced = cv2.cvtColor(hsv_image, cv2.COLOR_HSV2BGR)
        
        # Encode image to bytes
        _, buffer = cv2.imencode('.png', enhanced)
        return BytesIO(buffer.tobytes())
        