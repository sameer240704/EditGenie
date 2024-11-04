from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from io import BytesIO
import cv2
from services.black_and_white import BlackAndWhite
from services.color_enhancement import ColorEnhancementService
from services.image_watermark import add_watermark
from schema import ColorEnhancementRequest, ColorEnhancementResponse
from services.background_remover import BackgroundRemover

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
async def upload_image(file: UploadFile = File(...), service: str = Form(...),watermark: str = Form(...)):
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
            processed_img = add_watermark(img,watermark)
        elif service == "Color Enhancement":  # Additional service examples
            processed_img = ColorEnhancementService(img)
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
    
# @app.post("/api/enhance-color")
# async def enhance_color(
#     image: UploadFile = File(...),
#     color: tuple[int, int, int] = (0, 0, 0),
#     enhancement_factor: float = 1.5
# ):
#     try:
#         enhanced_image = await color_service.enhance_color(
#             image, 
#             color, 
#             enhancement_factor
#         )
#         return ColorEnhancementResponse(
#             success=True,
#             message="Image enhanced successfully",
#             image_url="/path/to/saved/image"  # Implement your image storage logic
#         )
#     except Exception as e:
#         return ColorEnhancementResponse(
#             success=False,
#             message=str(e)
#         )
