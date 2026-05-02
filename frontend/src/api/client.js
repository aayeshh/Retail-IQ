const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (error) {
    throw new Error(
      `Cannot connect to backend at ${API_BASE_URL}. Please start backend server and MongoDB, then try again.`
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const errorMessage =
      (payload && (payload.error || payload.message)) ||
      `Request failed (${response.status})`;
    throw new Error(errorMessage);
  }

  return payload;
}

export { API_BASE_URL };
