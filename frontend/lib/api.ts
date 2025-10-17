const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchApi<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || `HTTP error! status: ${response.status}`);
  }

  return json.data as T;
}

export const api = {
  getUsers: async (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const response = await fetch(`${API_URL}/users?${query}`, {
      headers: { "Content-Type": "application/json" }
    });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Failed to fetch users");
    }

    return {
      data: json.data,
      pagination: json.pagination
    };
  },
  getWeeklyStats: () => fetchApi("/users/weekly-stats"),
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
    }),

  protoExportedUsers: async () => {
    const response = await fetch(`${API_URL}/users/export`, {
      headers: {
        "Content-Type": "application/octet-stream"
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.arrayBuffer();
  },

  getPublicKey: async () => {
    const res = await fetch(`${API_URL}/users/publicKey`, {
      headers: {
        "Content-Type": "text/plain"
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.text();
  },

  healthCheck: async () => {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000) // 5s timeout
    });

    if (!response.ok) {
      throw new Error(`Server health check failed: ${response.status}`);
    }

    return response.json();
  }
};
