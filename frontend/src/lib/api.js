const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

async function request(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    ...rest
  } = options

  const config = {
    method,
    headers: {
      ...headers,
    },
    ...rest,
  }

  if (body !== undefined) {
    config.headers["Content-Type"] = "application/json"
    config.body = JSON.stringify(body)
  }

  const token = localStorage.getItem("access_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    config
  )

  let data = null

  const contentType = response.headers.get("content-type")

  if (contentType?.includes("application/json")) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.detail
        ? data.detail
        : `Request failed with status ${response.status}`

    throw new Error(message)
  }

  return data
}

/* ================= AUTH ================= */

export const authApi = {
  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: payload,
    }),

  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      body: payload,
    }),

  me: () =>
    request("/api/auth/me"),
}

/* ================= EVENTS ================= */

export const eventsApi = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value)
      }
    })

    const query = searchParams.toString()

    return request(
      `/api/events${query ? `?${query}` : ""}`
    )
  },

  getById: (id) =>
    request(`/api/events/${id}`),

  create: (payload) =>
    request("/api/events", {
      method: "POST",
      body: payload,
    }),

  update: (id, payload) =>
    request(`/api/events/${id}`, {
      method: "PUT",
      body: payload,
    }),

  remove: (id) =>
    request(`/api/events/${id}`, {
      method: "DELETE",
    }),

  register: (id) =>
    request(`/api/events/${id}/register`, {
      method: "POST",
    }),
}

/* ================= REGISTRATIONS ================= */

export const registrationsApi = {
  getMine: () =>
    request("/api/my-registrations"),

  cancel: (registrationId) =>
    request(`/api/registrations/${registrationId}`, {
      method: "DELETE",
    }),
}

/* ================= ORGANIZER ================= */

export const organizerApi = {
  getDashboard: () =>
    request("/api/organizer/dashboard"),

  getEvents: () =>
    request("/api/organizer/events"),

  getAttendees: (eventId) =>
    request(`/api/events/${eventId}/attendees`),
}

/* ================= PROFILE ================= */

export const profileApi = {
  update: (payload) =>
    request("/api/profile", {
      method: "PUT",
      body: payload,
    }),
}