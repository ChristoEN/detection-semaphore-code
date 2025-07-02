import gdown
import os

def download_model():
    model_path = "./model/semaphore_classification_mobilenetv2.h5"
    encoder_path = "./model/label_encoder_semaphore.pkl"

    if not os.path.exists("./model"):
        os.makedirs("./model")

    if not os.path.exists(model_path):
        print("Downloading model .h5 from Google Drive...")
        gdown.download(
            "https://drive.google.com/drive/folders/1V5fUfkWFmG7EHYlt5l4nxggkeE0JDcT3?usp=sharing",
            model_path,
            quiet=False,
        )

    if not os.path.exists(encoder_path):
        print("Downloading label encoder .pkl from Google Drive...")
        gdown.download(
            "https://drive.google.com/drive/folders/1V5fUfkWFmG7EHYlt5l4nxggkeE0JDcT3?usp=sharing",
            encoder_path,
            quiet=False,
        )
