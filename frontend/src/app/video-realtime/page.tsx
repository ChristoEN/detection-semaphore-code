"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";

export default function VideoDetectionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const bboxCanvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [animationId, setAnimationId] = useState<number | null>(null);
  const [lastPrediction, setLastPrediction] = useState<{
    label: string;
    confidence: number;
    bbox: [number, number, number, number];
  } | null>(null);
  const [capturedLabels, setCapturedLabels] = useState<string[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [autoCapture, setAutoCapture] = useState(false);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          const videoWidth = videoRef.current!.videoWidth;
          const videoHeight = videoRef.current!.videoHeight;

          if (videoCanvasRef.current && bboxCanvasRef.current) {
            videoCanvasRef.current.width = videoWidth;
            videoCanvasRef.current.height = videoHeight;
            bboxCanvasRef.current.width = videoWidth;
            bboxCanvasRef.current.height = videoHeight;
          }

          videoRef.current!.play();
          startPredictionLoop();
        };
      }
      setCameraActive(true);
    } catch (error) {
      console.error("Failed to access camera:", error);
    }
  };

  const startPredictionLoop = () => {
    let lastTimestamp = 0;
    const PREDICTION_INTERVAL_MS = 200;

    const loop = (timestamp: number) => {
      if (timestamp - lastTimestamp >= PREDICTION_INTERVAL_MS) {
        captureAndPredict();
        lastTimestamp = timestamp;
      }
      const id = requestAnimationFrame(loop);
      setAnimationId(id);
    };
    requestAnimationFrame(loop);
  };

  const toggleAutoCapture = () => {
    if (autoCapture) {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }
    } else {
      captureIntervalRef.current = setInterval(() => {
        if (lastPrediction) {
          setCapturedLabels((prev) => [...prev, lastPrediction.label]);
        }
      }, 5000);
    }
    setAutoCapture(!autoCapture);
  };

  const stopCamera = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    setAutoCapture(false);

    if (animationId) {
      cancelAnimationFrame(animationId);
      setAnimationId(null);
    }

    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());

    if (videoCanvasRef.current) {
      const ctx = videoCanvasRef.current.getContext("2d");
      ctx?.clearRect(
        0,
        0,
        videoCanvasRef.current.width,
        videoCanvasRef.current.height,
      );
    }

    if (bboxCanvasRef.current) {
      const ctx = bboxCanvasRef.current.getContext("2d");
      ctx?.clearRect(
        0,
        0,
        bboxCanvasRef.current.width,
        bboxCanvasRef.current.height,
      );
    }

    setCameraActive(false);
    setLastPrediction(null);
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const captureAndPredict = async () => {
    if (!videoRef.current || !videoCanvasRef.current || isPredicting) return;

    setIsPredicting(true);
    const video = videoRef.current;
    const canvas = videoCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.8);
      });

      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      const res = await fetch("http://127.0.0.1:8000/predict-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data && data.bbox) {
        setLastPrediction({
          label: data.label,
          confidence: data.confidence,
          bbox: data.bbox,
        });
        drawBoundingBox(data.bbox, data.label, data.confidence);
      } else {
        clearBoundingBox();
        setLastPrediction(null);
      }
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  const drawBoundingBox = (
    bbox: [number, number, number, number],
    label: string,
    confidence: number,
  ) => {
    if (!bboxCanvasRef.current) return;

    const ctx = bboxCanvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      bboxCanvasRef.current.width,
      bboxCanvasRef.current.height,
    );

    const [xMin, yMin, xMax, yMax] = bbox;

    ctx.strokeStyle = "lime";
    ctx.lineWidth = 3;
    ctx.strokeRect(xMin, yMin, xMax - xMin, yMax - yMin);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(xMin, yMin - 25, ctx.measureText(label).width + 20, 25);

    ctx.fillStyle = "lime";
    ctx.font = "16px Arial";
    ctx.fillText(`${label} (${confidence.toFixed(1)}%)`, xMin + 10, yMin - 8);
  };

  const clearBoundingBox = () => {
    if (!bboxCanvasRef.current) return;
    const ctx = bboxCanvasRef.current.getContext("2d");
    ctx?.clearRect(
      0,
      0,
      bboxCanvasRef.current.width,
      bboxCanvasRef.current.height,
    );
  };

  const handleCaptureResult = () => {
    if (lastPrediction) {
      setCapturedLabels((prev) => [...prev, lastPrediction.label]);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: 768, mx: "auto", p: 2 }}>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        color="#252C58"
        sx={{ marginBottom: "20px" }}
      >
        Real-time Semaphore Detection
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          color={cameraActive ? "error" : "primary"}
          onClick={toggleCamera}
        >
          {cameraActive ? "Turn Off Camera" : "Turn On Camera"}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleCaptureResult}
          disabled={!lastPrediction}
        >
          Manual Capture
        </Button>

        <Button
          variant="contained"
          color={autoCapture ? "error" : "success"}
          onClick={toggleAutoCapture}
          disabled={!cameraActive}
        >
          {autoCapture ? "Stop Auto Capture" : "Start Auto Capture (5s)"}
        </Button>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          position: "relative",
          overflow: "hidden",
          height: 480,
          bgcolor: "#000",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ display: "none" }}
        />

        <canvas
          ref={videoCanvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />

        <canvas
          ref={bboxCanvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Paper>

      {capturedLabels.length > 0 && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle1">Captured Results:</Typography>
          <Typography variant="body1" color="primary">
            {capturedLabels.join(" ")}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {autoCapture ? "Auto-capturing every 5 seconds" : "Manual capture"}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
