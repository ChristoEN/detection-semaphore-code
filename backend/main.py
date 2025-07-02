from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))
from predict import predict_image

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
