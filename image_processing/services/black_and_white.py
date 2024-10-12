import cv2
import numpy as np

def BlackAndWhite(image: np.ndarray) -> np.ndarray:
    gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    return gray_img