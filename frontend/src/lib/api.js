const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000"


// =========================================================
// API REQUEST HELPER
// =========================================================

export async function apiRequest(
  endpoint,
  options = {}
) {
  const token = getToken()

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  }


  // Add JSON content type unless using FormData

  if (
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] =
      "application/json"
  }


  // Add JWT automatically

  if (token) {
    headers.Authorization =
      `Bearer ${token}`
  }


  const requestOptions = {
    ...options,
    headers,
  }


  // Convert JavaScript objects to JSON

  if (
    requestOptions.body &&
    typeof requestOptions.body === "object" &&
    !(requestOptions.body instanceof FormData)
  ) {
    requestOptions.body =
      JSON.stringify(
        requestOptions.body
      )
  }


  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    requestOptions
  )


  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }


  // =======================================================
  // ERROR HANDLING
  // =======================================================

  if (!response.ok) {
    let errorMessage =
      "Something went wrong."


    if (data?.detail) {

      // FastAPI validation errors

      if (
        Array.isArray(
          data.detail
        )
      ) {
        errorMessage =
          data.detail
            .map((error) => {

              if (
                typeof error === "string"
              ) {
                return error
              }

              return (
                error?.msg ||
                "Validation error."
              )
            })
            .join(", ")
      }


      // Normal FastAPI error

      else if (
        typeof data.detail ===
        "string"
      ) {
        errorMessage =
          data.detail
      }


      // Structured error object

      else if (
        typeof data.detail ===
        "object"
      ) {
        errorMessage =
          data.detail.message ||
          data.detail.msg ||
          JSON.stringify(
            data.detail
          )
      }

    }


    throw new Error(
      errorMessage
    )
  }


  return data
}


// =========================================================
// TOKEN FUNCTIONS
// =========================================================

export function saveToken(
  token
) {
  localStorage.setItem(
    "evently_token",
    token
  )
}


export function getToken() {
  return localStorage.getItem(
    "evently_token"
  )
}


export function removeToken() {
  localStorage.removeItem(
    "evently_token"
  )
}