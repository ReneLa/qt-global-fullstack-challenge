import type { User } from "@prisma/client";
import express, { type Router } from "express";
import path, { dirname } from "path";
import protobuf from "protobufjs";
import { fileURLToPath } from "url";
import { z } from "zod";

import { validate } from "../middlewares/validate.js";
import { sendSuccess } from "../utils/response.js";

import {
  createUser,
  deleteUser,
  getUsers,
  getWeeklyStats,
  updateUser
} from "../services/user-service.js";
import {
  createUserSchema,
  updateUserSchema
} from "../validations/user.schema.js";

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

router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers();
    sendSuccess(res, users, "Users retrieved successfully");
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

// Export user as Protobuf binary/message
router.get("/export", async (req, res) => {
  const users = await getUsers();

  //map to protobuf like format
  const protoUsers = users.map((u: User) => ({
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
});

// Public Key endpoint
import { getPublicKeyPem } from "../utils/user-signing.js";
router.get("/publicKey", (req, res) => {
  res.type("text/plain").send(getPublicKeyPem());
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

export default router;
