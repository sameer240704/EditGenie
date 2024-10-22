from pydantic import BaseModel
from typing import Tuple

class ColorEnhancementRequest(BaseModel):
    color: Tuple[int, int, int]
    enhancement_factor: float

class ColorEnhancementResponse(BaseModel):
    success: bool
    message: str
    image_url: str | None = None