const API_URL =
  import.meta.env.VITE_API_URL || "https://healthcare-appointment-manager-nlir.onrender.com";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message || `Request failed: ${response.status}`
    );
  }

  return data;
}

/* =========================
   AUTH
   ========================= */

export async function registerUser(data) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   DOCTORS
   ========================= */

export async function getDoctors() {
  return request("/api/doctors");
}

export async function getDoctor(id) {
  return request(`/api/doctors/${id}`);
}

/* =========================
   SLOTS
   ========================= */

export async function getSlots(doctorId, date) {
  return request(
    `/api/slots/doctor/${doctorId}?date=${date}`
  );
}

/* =========================
   APPOINTMENTS
   ========================= */

export async function createAppointment(data, token) {
  return request("/api/appointments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getMyAppointments(token) {
  return request("/api/appointments/my", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function cancelAppointment(id, token) {
  return request(`/api/appointments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
/* =========================
   ADMIN AVAILABILITY
   ========================= */

export async function createAvailability(data, token) {
  return request("/api/admin/availability", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getDoctorAvailability(doctorId) {
  return request(`/api/availability/doctor/${doctorId}`);
}

export async function deleteAvailability(id, token) {
  return request(`/api/admin/availability/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
/* =========================
   ADMIN DOCTOR LEAVES
   ========================= */

export async function getDoctorLeaves(
  doctorId,
  token
) {
  return request(
    `/api/admin/leaves/doctor/${doctorId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function createDoctorLeave(
  data,
  token
) {
  return request("/api/admin/leaves", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteDoctorLeave(
  id,
  token
) {
  return request(`/api/admin/leaves/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
/* =========================
   ADMIN APPOINTMENTS
   ========================= */

export async function getAdminAppointments(
  doctorId,
  date,
  token
) {
  return request(
    `/api/admin/appointments/doctor/${doctorId}?date=${date}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
