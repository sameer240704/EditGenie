import cv2
import numpy as np

def ColorEnhancer(image, color: tuple, enhancement_factor: float = 7.5):
    # Convert to HSV
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    bgr_color = (color[2], color[1], color[0])
    hsv_color = cv2.cvtColor(np.uint8([[bgr_color]]), cv2.COLOR_BGR2HSV)[0][0]

    # Create color mask
    lower_bound = np.array([max(0, hsv_color[0] - 10), 50, 50])
    upper_bound = np.array([min(179, hsv_color[0] + 10), 255, 255])
    mask = cv2.inRange(hsv_image, lower_bound, upper_bound)

    # Enhance color
    hsv_image[:, :, 1] = np.where(mask == 255, 
                                    np.minimum(hsv_image[:, :, 1] * enhancement_factor, 255),
                                    hsv_image[:, :, 1])
    
    # Reduce saturation of other colors
    hsv_image[:, :, 1] = np.where(mask == 0, 
                                   np.maximum(hsv_image[:, :, 1] * (1 / enhancement_factor), 0),
                                   hsv_image[:, :, 1])

    # Convert back to BGR and return
    enhanced = cv2.cvtColor(hsv_image, cv2.COLOR_HSV2BGR)
    
    return enhanced
        