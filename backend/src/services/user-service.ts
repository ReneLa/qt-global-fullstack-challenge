import { PrismaClient } from "@prisma/client";

import { ConflictError, NotFoundError } from "../utils/errors.js";
import logger from "../utils/logger.js";
import { hashEmail, signHash } from "../utils/user-signing.js";

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

export async function getUsers(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const total = await prisma.user.count();

  const users = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" }
  });

  const totalPages = Math.ceil(total / limit);

  logger.info(
    `Found ${users.length} users (page ${page}/${totalPages}, total: ${total})`
  );

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

export async function getWeeklyStats() {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setUTCDate(today.getUTCDate() - 6);
  sevenDaysAgo.setUTCHours(0, 0, 0, 0); // Start of day in UTC

  // Parallel queries for better performance
  const [summaryStats, recentUsers] = await Promise.all([
    prisma.user.groupBy({
      by: ["role", "status"],
      _count: true
    }),

    // Only fetch users from last 7 days for the graph
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        role: true,
        createdAt: true
      }
    })
  ]);

  // Calculate totals from groupBy results
  let totalUsers = 0;
  let admins = 0;
  let users = 0;
  let active = 0;
  let inactive = 0;

  summaryStats.forEach((group) => {
    const count = group._count;
    totalUsers += count;

    if (group.role === "ADMIN") admins += count;
    if (group.role === "USER") users += count;
    if (group.status === "ACTIVE") active += count;
    if (group.status === "INACTIVE") inactive += count;
  });

  // Build graph data from recent users only
  const dateMap = new Map<string, { admins: number; users: number }>();

  // Initialize all dates
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setUTCDate(sevenDaysAgo.getUTCDate() + i);
    const dateStr = date.toISOString().split("T")[0]!;
    dateMap.set(dateStr, { admins: 0, users: 0 });
  }

  // Count only recent users
  recentUsers.forEach((user) => {
    const dateStr = new Date(user.createdAt).toISOString().split("T")[0]!;
    if (dateMap.has(dateStr)) {
      const counts = dateMap.get(dateStr)!;
      if (user.role === "ADMIN") {
        counts.admins++;
      } else {
        counts.users++;
      }
    }
  });

  const graphData = Array.from(dateMap.entries()).map(
    ([date, { admins, users }]) => ({
      date,
      admins,
      users,
      total: admins + users
    })
  );

  return {
    totalUsers,
    admins,
    users,
    active,
    inactive,
    graphData
  };
}

export async function updateUser(id: string, data: Partial<UserInput>) {
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  let updateData: {
    email?: string;
    role?: "ADMIN" | "USER";
    status?: "ACTIVE" | "INACTIVE";
    hash?: string;
    signature?: string;
  } = { ...data };

  if (data.email && data.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (emailExists) {
      throw new ConflictError("A user with this email already exists");
    }

    const newHash = hashEmail(data.email);
    const newSignature = signHash(newHash);
    updateData.hash = newHash;
    updateData.signature = newSignature;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData
  });

  logger.info(`User updated successfully: ${id}`);
  return user;
}

export async function deleteUser(id: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  if (!existingUser) {
    logger.error(`User not found: ${id}`);
    throw new NotFoundError("User not found");
  }

  const user = await prisma.user.delete({
    where: { id }
  });

  logger.info(`User deleted successfully: ${id}`);
  return user;
}
