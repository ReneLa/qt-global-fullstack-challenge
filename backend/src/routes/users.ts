import type { User } from "@prisma/client";
import express, { type Router } from "express";
import path, { dirname } from "path";
import protobuf from "protobufjs";
import { fileURLToPath } from "url";
import { z } from "zod";

import { validate } from "../middlewares/validate.js";
import { sendSuccess } from "../utils/response.js";
import { PrismaClient } from "@prisma/client";

import {
  createUser,
  deleteUser,
  getUsers,
  getWeeklyStats,
  updateUser
} from "../services/user-service.js";
import {
  createUserSchema,
  updateUserSchema,
  paginationSchema
} from "../validations/user.schema.js";

const __devPrisma = new PrismaClient();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router: Router = express.Router();

router.post("/", validate(createUserSchema, "body"), async (req, res, next) => {
  try {
    const { email, role, status } = req.body;
    const user = await createUser({ email, role, status });
    sendSuccess(res, user, "User created successfully", 201);
  } catch (error) {
    next(error);
  }
});

router.get("/", validate(paginationSchema, "query"), async (req, res, next) => {
  try {
    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const result = await getUsers(page, limit);

    res.json({
      status: 200,
      message: "Users retrieved successfully",
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

router.get("/weekly-stats", async (req, res, next) => {
  try {
    const stats = await getWeeklyStats();
    sendSuccess(res, stats, "Weekly stats retrieved successfully");
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:id",
  validate(z.object({ id: z.string().uuid() }), "params"),
  validate(updateUserSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email, role, status } = req.body;
      const user = await updateUser(id!, { email, role, status });
      sendSuccess(res, user, "User updated successfully");
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await deleteUser(id);
    sendSuccess(res, user, "User deleted successfully");
  } catch (error) {
    next(error);
  }
});

// Export users as Protobuf (defaults to all users with high limit)
router.get("/export", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1000;

    const result = await getUsers(page, limit);

    const protoUsers = result.data.map((u: User) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt.toISOString(),
      hash: u.hash,
      signature: u.signature
    }));

    const protoPath = path.join(__dirname, "..", "proto", "user.proto");
    const root = await protobuf.load(protoPath);
    const UserList = root.lookupType("UserList");
    const payload = { users: protoUsers };
    const err = UserList.verify(payload);

    if (err) return res.status(500).send(err);

    const buffer = UserList.encode(payload).finish();
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(buffer);
  } catch (error) {
    res.status(500).send("Error exporting users");
  }
});

// Public Key endpoint
import { getPublicKeyPem } from "../utils/user-signing.js";
router.get("/publicKey", (req, res) => {
  res.type("text/plain").send(getPublicKeyPem());
});

// Dev-only endpoint to create a user with non-verifiable signature for testing
router.post("/test/invalid", async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).send("Forbidden");
    }

    const { email, role, status, mode } = req.body as {
      email: string;
      role: "ADMIN" | "USER";
      status: "ACTIVE" | "INACTIVE";
      mode?: "invalid" | "empty";
    };

    const hash = mode === "empty" ? "" : "deadbeef";
    const signature = mode === "empty" ? "" : "invalid";

    const user = await __devPrisma.user.create({
      data: { email, role, status, hash, signature }
    });

    sendSuccess(res, user, "Test user created", 201);
  } catch (error) {
    next(error);
  }
});

export default router;
