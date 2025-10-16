const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchApi(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getUsers: () => fetchApi("/users"),
  createUser: ({
    email,
    role,
    status
  }: {
    email: string;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
  }) =>
    fetchApi("/users", {
      method: "POST",
      body: JSON.stringify({ email, role, status }),
      headers: {
        "Content-Type": "application/json"
      }
    }),
  updateUser: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
    fetchApi(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }),
  deleteUser: (id: string) =>
    fetchApi(`/users/${id}`, {
      method: "DELETE"
    })
};
