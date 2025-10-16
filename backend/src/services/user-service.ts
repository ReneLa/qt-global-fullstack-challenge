import { PrismaClient } from "@prisma/client";

import logger from "../utils/logger.js";
import { hashEmail, signHash } from "../utils/user-signing.js";
import { ConflictError, NotFoundError } from "../utils/errors.js";

const prisma = new PrismaClient();

interface UserInput {
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
}

export async function createUser(userInput: UserInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: userInput.email }
  });

  if (existingUser) {
    throw new ConflictError("A user with this email already exists");
  }

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

  logger.info(`User created successfully: ${user.id}`);
  return user;
}

export async function getUsers() {
  const users = await prisma.user.findMany();
  logger.info(`Found ${users.length} users`);
  return users;
}

export async function updateUser(id: string, data: Partial<UserInput>) {
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  if (data.email && data.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (emailExists) {
      throw new ConflictError("A user with this email already exists");
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data
  });

  logger.info(`User updated successfully: ${id}`);
  return user;
}

export async function deleteUser(id: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  const user = await prisma.user.delete({
    where: { id }
  });

  logger.info(`User deleted successfully: ${id}`);
  return user;
}
