import cv2
import numpy as np
import mediapipe as mp

def FocusEffect(image: np.ndarray) -> np.ndarray:

    mp_selfie_segmentation = mp.solutions.selfie_segmentation
    with mp_selfie_segmentation.SelfieSegmentation(model_selection=0) as segmentor:

    # Apply the segmentation on the RGB image
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = segmentor.process(rgb_image)

    # Get the segmentation mask
        mask = results.segmentation_mask

    # Create binary mask for background and foreground
        threshold = 0.5  # Adjust for better accuracy
        binary_mask = (mask > threshold).astype(np.uint8) * 255  # Foreground mask
        binary_mask_inv = cv2.bitwise_not(binary_mask)  # Background mask

    # Option 1: Blur the foreground
        foreground = cv2.bitwise_and(image, image, mask=binary_mask)

    # Option 2: Blur the background
        blurred_image = cv2.GaussianBlur(image, (175, 175), 20)
        background = cv2.bitwise_and(blurred_image, blurred_image, mask=binary_mask_inv)
        final_image = cv2.add(foreground, background)

    return final_image