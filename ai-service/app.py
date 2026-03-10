import base64
import requests
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from PIL import Image
from io import BytesIO
from rembg import remove

app = FastAPI()

model = None

@app.on_event("startup")
def load_model():
    global model
    model = SentenceTransformer("clip-ViT-B-32")


class ImageReq(BaseModel):
    image_url: str


class TextReq(BaseModel):
    text: str


class RemoveBgReq(BaseModel):
    image: str


@app.post("/remove-background")
def remove_background(req: RemoveBgReq):

    if "," in req.image:
        req.image = req.image.split(",")[1]

    img_data = base64.b64decode(req.image)
    image = Image.open(BytesIO(img_data)).convert("RGBA")

    output = remove(image)

    max_width = 800
    if output.width > max_width:
        ratio = max_width / output.width
        new_height = int(output.height * ratio)
        output = output.resize((max_width, new_height), Image.LANCZOS)

    buffer = BytesIO()
    output.save(buffer, format="PNG", optimize=True)
    buffer.seek(0)

    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return {"image_base64": encoded}


@app.post("/embed-image")
def embed_image(req: ImageReq):

    resp = requests.get(req.image_url, timeout=10)
    resp.raise_for_status()

    image = Image.open(BytesIO(resp.content)).convert("RGB")

    emb = model.encode(image)

    return {"embedding": emb.tolist()}


@app.post("/embed-text")
def embed_text(req: TextReq):

    emb = model.encode(req.text)

    return {"embedding": emb.tolist()}


@app.get("/health")
def health():
    return {
        "message": "AI Service is healthy",
        "model_loaded": model is not None
    }