import torch
import open_clip
import requests
from fastapi import FastAPI
from pydantic import BaseModel
from PIL import Image
from io import BytesIO

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