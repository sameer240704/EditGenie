import cv2
import numpy as np

def BlackAndWhite(image: np.ndarray) -> np.ndarray:
    # gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # return gray_img

    gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    m, n = gray_img.shape

    median_pass_image = np.zeros((m, n), dtype='uint8')


    def median_filter(image_patch):
        return np.median(image_patch)
    
    for i in range(1, m-1):
        for j in range(1, n-1):
            median_pass_image[i, j] = median_filter(gray_img[i-1:i+2, j-1:j+2])
    
    return median_pass_image