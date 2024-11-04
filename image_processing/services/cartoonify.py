import cv2
import numpy as np

def create_edge_mask(img, line_size = 9, blur_value = 7):
    gray_img = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    gray_blur = cv2.medianBlur(gray_img, blur_value)

    edges = cv2.adaptiveThreshold(gray_blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, line_size, blur_value)

    return edges

def color_quantization(img, val):
    data = np.float32(img).reshape((-1, 3))

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 50, 0.01)

    ret, label, center = cv2.kmeans(data, val, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    center = np.uint8(center)

    result = center[label.flatten()]
    result = result.reshape(img.shape)

    return result

def Cartoonify(image: np.ndarray) -> np.ndarray:
    edges = create_edge_mask(image, 7, 5)
    quant_img = color_quantization(image, 10)
    blurred_img = cv2.bilateralFilter(quant_img, d=7, sigmaColor=250, sigmaSpace=250)

    final_img = cv2.bitwise_and(blurred_img, blurred_img, mask = edges)

    return final_img
