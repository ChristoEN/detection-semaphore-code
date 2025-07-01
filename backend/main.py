from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from utils import predict_image

app = FastAPI()

# CORS biar frontend bisa akses
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict-image")
async def predict_image_endpoint(file: UploadFile = File(...)):
    result = await predict_image(file)
    return result
