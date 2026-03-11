const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getHeaders(token, isFormData = false) {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

export const api = {
  get: (path, token) =>
    fetch(`${BASE}${path}`, { headers: getHeaders(token) }).then(handle),

  post: (path, body, token) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(body),
    }).then(handle),

  put: (path, body, token) =>
    fetch(`${BASE}${path}`, {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(body),
    }).then(handle),

  patch: (path, body, token) =>
    fetch(`${BASE}${path}`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(body),
    }).then(handle),

  delete: (path, token) =>
    fetch(`${BASE}${path}`, {
      method: "DELETE",
      headers: getHeaders(token),
    }).then(handle),

  upload: (path, formData, token) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers: getHeaders(token, true), // no Content-Type for multipart
      body: formData,
    }).then(handle),
};

export default api;