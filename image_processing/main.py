from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from io import BytesIO
import cv2
from services.black_and_white import BlackAndWhite
from services.color_enhancement import ColorEnhancer
from services.image_watermark import add_watermark
from services.focus_effect import FocusEffect
from services.background_remover import BackgroundRemover
from services.cartoonify import Cartoonify
from typing import Optional
import json

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...), service: str = Form(...), watermark: str = Form(None), color: Optional[str] = Form(None)):
    try:
        contents = await file.read()
        np_img = np.frombuffer(contents, np.uint8)
        
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if img is None:
            return JSONResponse(content={"error": "Invalid image format"}, status_code=400)
        
        processed_img = None
        if service == "Background Removal":
            processed_img = BackgroundRemover(img)
        elif service == "Image Copywriter":
            processed_img = add_watermark(img, watermark)
        elif service == "Color Enhancer":  
            color_tuple = None
            if color.startswith('"') and color.endswith('"'):
                color = color[1:-1] 

            if color.startswith("rgb(") and color.endswith(")"):
                color_values = color[4:-1]  
                color_tuple = tuple(int(c.strip()) for c in color_values.split(','))
                
            processed_img = ColorEnhancer(img, color_tuple)
        elif service == "Focus Effect":
            processed_img = FocusEffect(img)
        elif service == "Cartoonify":
            processed_img = Cartoonify(img)
        else:
            return JSONResponse(content={"error": "Service not recognized"}, status_code=400)

        
        if processed_img is None:
            return JSONResponse(content={"error": "Image processing failed."}, status_code=500)

    
        _, buffer = cv2.imencode('.png', processed_img)
        processed_image_bytes = buffer.tobytes()

        return StreamingResponse(BytesIO(processed_image_bytes), media_type="image/png")

    except Exception as e:
        print("Error in /upload-image endpoint:", str(e))
        return JSONResponse(content={"error": str(e)}, status_code=500)

