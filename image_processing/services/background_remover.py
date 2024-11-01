import cv2
import numpy as np

def BackgroundRemover(image: np.ndarray) -> np.ndarray:
    m, n = image.shape[:2]

    mask = np.zeros((m, n), np.uint8)

    backgrd_model = np.zeros((1, 65), np.float64)
    foregrd_model = np.zeros((1, 65), np.float64)

    rect = (50, 50, m - 100, n - 100)

    cv2.grabCut(image, mask, rect, backgrd_model, foregrd_model, 5, cv2.GC_INIT_WITH_RECT)

    mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')

    image_no_bg = image * mask2[:, :, np.newaxis]

    return image_no_bg