import axios from "axios";

export async function predictImageApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);

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
    return response.data;
  } catch (error) {
    console.error("Prediction error:", error);
    throw error;
  }
}
