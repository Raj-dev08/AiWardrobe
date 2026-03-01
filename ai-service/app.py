import base64

import torch
import open_clip
import requests
from fastapi import FastAPI
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
from rembg import remove

app = FastAPI()

device = "cuda" if torch.cuda.is_available() else "cpu"

model, _, preprocess = open_clip.create_model_and_transforms(
    "ViT-B-32",
    pretrained="laion2b_s34b_b79k"
)
model = model.to(device)
model.eval()

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
    image = Image.open(BytesIO(img_data))
    output = remove(image)
    max_width = 800
    if output.width > max_width:
        ratio = max_width / output.width
        new_height = int(output.height * ratio)
        output = output.resize((max_width, new_height), Image.LANCZOS)

    buffer = BytesIO()
    output.save(buffer, format="PNG", optimize=True, quality=80)
    buffer.seek(0)
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    
    return {"image_base64": encoded}

@app.post("/embed-image")
def embed_image(req: ImageReq):
    img_bytes = requests.get(req.image_url).content
    image = Image.open(BytesIO(img_bytes)).convert("RGB")

    img_tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        emb = model.encode_image(img_tensor)
        emb = emb / emb.norm(dim=-1, keepdim=True)

    return {"embedding": emb[0].cpu().tolist()}

@app.post("/embed-text")
def embed_text(req: TextReq):
    text = req.text  

    with torch.no_grad():
        text_tokens = open_clip.tokenize([text]).to(device)
        emb = model.encode_text(text_tokens)
        emb = emb / emb.norm(dim=-1, keepdim=True)

    return {"embedding": emb[0].cpu().tolist()}

@app.get("/health")
def health():
    return {"message": "AI Service is healthy"}