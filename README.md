# Real-Time Semaphore Gesture Detection

## Project Overview

This project is a **Real-Time Semaphore Gesture Recognition App** built with **MediaPipe Pose**, **TensorFlow MobileNetV2**, **FastAPI (Python)** for the backend, and **Next.js (React + TypeScript)** for the frontend.

It allows users to:

✅ Capture real-time webcam video  
✅ Send frames to the backend for gesture classification  
✅ Display the predicted gesture label (A-Z) with a bounding box overlay  
✅ Support both **manual** and **auto capture** (every 5 seconds)  
✅ Backend runs locally (or can be deployed), with the ML model stored locally or loaded from Google Drive  

---

## Tech Stack

- **Frontend:** Next.js (React + TypeScript) + Material UI
- **Backend:** FastAPI + TensorFlow + MediaPipe
- **Pose Detection:** MediaPipe Pose
- **ML Model:** MobileNetV2 trained with TensorFlow/Keras
- **Frontend Hosting (CS):** Vercel
- **Backend Hosting (CS):** Railway / Hugging Face Spaces / Localhost
