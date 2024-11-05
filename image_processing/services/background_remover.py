import cv2
import numpy as np
import mediapipe as mp

def BackgroundRemover(image: np.ndarray) -> np.ndarray:

    mp_selfie_segmentation = mp.solutions.selfie_segmentation
    with mp_selfie_segmentation.SelfieSegmentation(model_selection=0) as segmentor:

        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = segmentor.process(rgb_image)

        mask = results.segmentation_mask

        threshold = 0.5  # Adjust for better accuracy
        binary_mask = (mask > threshold).astype(np.uint8) * 255  # Foreground mask
        binary_mask_inv = cv2.bitwise_not(binary_mask)  # Background mask

        # Foreground: Retain the original image where the mask is the person
        foreground = cv2.bitwise_and(image, image, mask=binary_mask)

        # Background: Replace the background with black pixels
        black_background = np.zeros_like(image)  # Creates a black background
        background = cv2.bitwise_and(black_background, black_background, mask=binary_mask_inv)

        # Combine foreground (person) and black background
        final_image = cv2.add(foreground, background)

    return final_image