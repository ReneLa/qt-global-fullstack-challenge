import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
}

interface UserInput {
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
}

export async function createUser(userInput: UserInput) {
  //TODO: Handle email hashing and signing

  const user = await prisma.user.create({
    data: {
      email: userInput.email,
      role: userInput.role,
      status: userInput.status
    }
  });

  return user;
}

export async function getUsers() {
  const users = await prisma.user.findMany();
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