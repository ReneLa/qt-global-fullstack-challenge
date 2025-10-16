import express, { type Router } from "express";
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
