import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((request) => {
  console.log(`[API] Request: ${request.method.toUpperCase()} ${request.url}`, {
    data: request.data,
    params: request.params,
  });
  return request;
});

API.interceptors.response.use(
  (response) => {
    console.log(`[API] Response: ${response.config.method.toUpperCase()} ${response.config.url}`, {
      status: response.status,
    });
    return response;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

export const uploadDocument = (formData) =>
  API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getDocuments = () => API.get("/documents");

export const getDocumentById = (id) => API.get(`/document/${id}`);

export const searchDocuments = (query) => API.get(`/search?q=${encodeURIComponent(query)}`);

export default API;