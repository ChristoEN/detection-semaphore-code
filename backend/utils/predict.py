import numpy as np
from keras.models import load_model
import joblib
import cv2
import mediapipe as mp
from io import BytesIO
from PIL import Image

model = load_model("./model/semaphore_classification_mobilenetv2.h5")
le = joblib.load("./model/label_encoder_semaphore.pkl")

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

async def predict_image(file):
    contents = await file.read()
    pil_image = Image.open(BytesIO(contents)).convert("RGB")
    image_np = np.array(pil_image)

    h, w, _ = image_np.shape
    image_rgb = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    results = pose.process(image_rgb)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        indices = [11, 13, 15, 12, 14, 16]
        xs = [landmarks[i].x for i in indices]
        ys = [landmarks[i].y for i in indices]

        x_min = max(int(min(xs) * w) - 20, 0)
        y_min = max(int(min(ys) * h) - 20, 0)
        x_max = min(int(max(xs) * w) + 20, w)
        y_max = min(int(max(ys) * h) + 20, h)

        if x_max <= x_min or y_max <= y_min:
            return {"error": "Bounding box terlalu kecil."}

        crop = image_np[y_min:y_max, x_min:x_max]
        resized = cv2.resize(crop, (224, 224)) / 255.0
        input_data = np.expand_dims(resized, axis=0)

        pred = model.predict(input_data, verbose=0)[0]
        pred_index = np.argmax(pred)
        confidence = float(pred[pred_index]) * 100

        predicted_number = le.classes_[pred_index]
        try:
            predicted_char = chr(64 + int(predicted_number)) 
        except:
            predicted_char = str(predicted_number)

        return {
            "label": predicted_char,
            "confidence": confidence,
            "bbox": [int(x_min), int(y_min), int(x_max), int(y_max)],
        }

    return {"error": "Tidak ditemukan pose landmark."}
