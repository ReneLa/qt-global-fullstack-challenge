import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { decodeUserList } from "@/lib/proto";
import { importPublicKey, verifySignature } from "@/lib/verify";

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  hash: string;
  signature: string;
}

interface VerifiedUsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

async function fetchVerifiedUsers(params?: {
  page?: number;
  limit?: number;
}): Promise<VerifiedUsersResponse> {
  try {
    const [buffer, publicKeyPem, paginatedUsers] = await Promise.all([
      api.protoExportedUsers(),
      api.getPublicKey(),
      api.getUsers(params)
    ]);

    const usersData = await decodeUserList(buffer);
    const publicKey = await importPublicKey(publicKeyPem);

    // Get all users from protobuf for signature verification
    const allUsers = usersData.users || [];
    const verificationMap = new Map<string, boolean>();

    // Verify all users
    for (const user of allUsers as User[]) {
      const ok = await verifySignature(publicKey, user.hash, user.signature);
      verificationMap.set(user.id, ok);
    }

    // Filter paginated users based on verification
    const verifiedUsers = (paginatedUsers.data as User[]).filter(
      (user) => verificationMap.get(user.id) === true
    );

    return {
      users: verifiedUsers,
      pagination: paginatedUsers.pagination
    };
  } catch (error) {
    throw error;
  }
}

export function useVerifiedUsers(params?: { page?: number; limit?: number }) {
  return useQuery<VerifiedUsersResponse, Error>({
    queryKey: ["verifiedUsers", params?.page, params?.limit],
    queryFn: () => fetchVerifiedUsers(params),
    retry: false
  });
}
