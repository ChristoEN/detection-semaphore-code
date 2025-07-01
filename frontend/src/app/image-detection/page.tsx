"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

export default function ImageDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{
    label: string;
    confidence: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleCanvasClick = () => {
    document.getElementById("image-upload")?.click();
  };

  const handlePredict = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.error) {
        setError(response.data.error);
        setPrediction(null);
      } else {
        setPrediction({
          label: response.data.label,
          confidence: response.data.confidence,
        });
      }
    } catch (err) {
      setError("Gagal melakukan prediksi. Pastikan backend berjalan.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 768, mx: "auto", p: 2 }}>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        color="#252C58"
        sx={{ marginBottom: "20px" }}
      >
        Image Semaphore Detection
      </Typography>
      <Box
        sx={{
          p: 1.5,
          mb: 2,
          bgcolor: "rgba(227, 242, 253, 0.7)",
          border: 1,
          borderRadius: 1,
          borderColor: "#90caf9",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ErrorOutlineOutlinedIcon sx={{ color: "gray", mr: 1 }} />
        <Typography variant="body2" color="gray">
          Make sure the image shows the entire body and hands so that pose
          detection works optimally.
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed gray",
          bgcolor: "#f9f9f9",
          cursor: "pointer",
          mb: 2,
          position: "relative",
        }}
        onClick={handleCanvasClick}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <Box sx={{ textAlign: "center", color: "gray" }}>
            <AddPhotoAlternateIcon sx={{ fontSize: 50 }} />
            <Typography variant="body2">Click here to upload image</Typography>
          </Box>
        )}
      </Paper>

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handlePredict}
        disabled={!selectedImage || loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Check Result"
        )}
      </Button>

      {prediction && (
        <Paper
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "#e0f7fa",
            textAlign: "center",
          }}
        >
          {/* <Typography variant="subtitle1">Result</Typography> */}
          <Typography variant="h6" color="primary">
            {prediction.label} - {prediction.confidence.toFixed(1)}%
          </Typography>
        </Paper>
      )}

      {error && (
        <Paper sx={{ mt: 2, p: 2, bgcolor: "#ffebee", textAlign: "center" }}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
