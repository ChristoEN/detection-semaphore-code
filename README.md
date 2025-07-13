# 🧠 Real-Time Semaphore Gesture Detection

## 📌 Project Overview

**Real-Time Semaphore Gesture Recognition App** is a real-time gesture detection system that uses computer vision and machine learning technologies to recognize semaphore arm signals from live webcam input and classify them into letters A–Z.

### ✅ Key Features

- 📸 Capture real-time video from the user's webcam
- 🧠 Send frames to the backend for semaphore gesture classification
- 🏷️ Display predicted letter label (A–Z) with a bounding box overlay
- ⚙️ Supports two capture modes:
  - Manual Capture
  - Auto Capture (every 5 seconds)
- 🧳 Backend can run locally or be deployed to the cloud
- 💾 ML model can be stored locally or loaded from Google Drive

---

## 🛠️ Tech Stack

| Layer         | Tools/Frameworks                                        |
|---------------|---------------------------------------------------------|
| Frontend      | [Next.js](https://nextjs.org/) + React + TypeScript + Material UI |
| Backend       | [FastAPI](https://fastapi.tiangolo.com/) + Python + TensorFlow |
| Pose Detection| [MediaPipe Pose](https://developers.google.com/mediapipe/solutions/pose) |
| Model         | CNN based on MobileNetV2 trained on Semaphore gesture dataset |
| Hosting       | Frontend: [Vercel](https://vercel.com/)  |
|               | Backend: ❓ *To be determined*              |

---

## 📂 Project Structure

