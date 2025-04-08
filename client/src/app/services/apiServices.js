const API_BASE_URL = "http://localhost:4200/api"; // Replace with your base API URL

// Common API function
export async function apiRequest(
  endpoint,
  method = "GET",
  body = body && typeof body === "object" ? JSON.stringify(body) : null,
  headers = {}
) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers, // Merge additional headers
      },
      body: body ? JSON.stringify(body) : null, // Add body only if not null
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      );
    }

    // Nếu status là 204 (No Content), trả về null
    if (response.status === 204) {
      return null;
    }

    const data = await response.json(); // Parse JSON response
    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error; // Re-throw the error so the calling component can handle it
  }
}
