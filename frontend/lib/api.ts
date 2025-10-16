const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiResponse<T = any> {
  message: string;
  status: number;
  data?: T;
}

async function fetchApi<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  const json: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(json.message || `HTTP error! status: ${response.status}`);
  }

  return json.data as T;
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
