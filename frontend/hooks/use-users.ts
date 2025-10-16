import { useMutation, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => api.getUsers()
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (user: {
      email: string;
      role: "ADMIN" | "USER";
      status: "ACTIVE" | "INACTIVE";
    }) => api.createUser(user)
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: (user: { id: string; data: Record<string, unknown> }) =>
      api.updateUser(user)
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: string) => api.deleteUser(id)
  });
}
