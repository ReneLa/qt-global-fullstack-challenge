import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

export function useUsers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["users", params?.page, params?.limit],
    queryFn: () => api.getUsers(params)
  });
}

export function useWeeklyStats() {
  return useQuery({
    queryKey: ["weekly-stats"],
    queryFn: () => api.getWeeklyStats()
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: {
      email: string;
      role: "ADMIN" | "USER";
      status: "ACTIVE" | "INACTIVE";
    }) => api.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-stats"] });
      queryClient.invalidateQueries({ queryKey: ["verifiedUsers"] });
    },
    onError: (error) => {
      console.error("Error creating user", error);
    }
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: {
      id: string;
      data: {
        email?: string;
        role?: "ADMIN" | "USER";
        status?: "ACTIVE" | "INACTIVE";
      };
    }) => api.updateUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-stats"] });
      queryClient.invalidateQueries({ queryKey: ["verifiedUsers"] });
    },
    onError: (error) => {
      console.error("Error updating user", error);
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-stats"] });
    },
    onError: (error) => {
      console.error("Error deleting user", error);
    }
  });
}
