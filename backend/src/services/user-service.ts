import { PrismaClient } from "@prisma/client";
import { hashEmail, signHash } from "../utils/user-signing.js";
import logger from "../utils/logger.js";

const prisma = new PrismaClient();

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  hash: string;
  signature: string;
}

interface UserInput {
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
}

export async function createUser(userInput: UserInput) {
  const hash = hashEmail(userInput.email);

  const signature = signHash(hash);

  const user = await prisma.user.create({
    data: {
      email: userInput.email,
      role: userInput.role,
      status: userInput.status,
      hash,
      signature
    }
  });
  if (!user) {
    throw new Error("Failed to create user");
  }
  return user;
}

export async function getUsers() {
  const users = await prisma.user.findMany();
  logger.info(`Found ${users.length} users`);
  return users;
}

export async function updateUser(id: string, data: Partial<UserInput>) {
  const user = await prisma.user.update({
    where: { id },
    data
  });
  return user;
}

export async function deleteUser(id: string) {
  const user = await prisma.user.delete({
    where: { id }
  });
  return user;
}
