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

async function fetchVerifiedUsers(): Promise<User[]> {
  try {
    const [buffer, publicKeyPem] = await Promise.all([
      api.protoExportedUsers(),
      api.getPublicKey()
    ]);

    const usersData = await decodeUserList(buffer);
    const publicKey = await importPublicKey(publicKeyPem);

    const users = usersData.users || [];

    const verifiedUsers: User[] = [];

    for (const user of users as User[]) {
      const ok = await verifySignature(publicKey, user.hash, user.signature);

      if (ok) verifiedUsers.push(user);
    }

    return verifiedUsers;
  } catch (error) {
    throw error;
  }
}

export function useVerifiedUsers() {
  return useQuery<User[], Error>({
    queryKey: ["verifiedUsers"],
    queryFn: fetchVerifiedUsers,
    retry: false
  });
}
