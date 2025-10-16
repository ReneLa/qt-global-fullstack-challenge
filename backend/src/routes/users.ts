import express, { type Router } from "express";
import { z } from "zod";

import { validate } from "../middlewares/validate.js";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser
} from "../services/user-service.js";
import {
  createUserSchema,
  updateUserSchema
} from "../validations/user.schema.js";

import logger from "../utils/logger.js";

const router: Router = express.Router();

router.post("/", validate(createUserSchema, "body"), async (req, res) => {
  const { email, role, status } = req.body;

  const user = await createUser({ email, role, status });

  res.json(user);
});

router.get("/", async (req, res) => {
  const users = await getUsers();

  return res.json(users);
});

router.put(
  "/:id",
  validate(z.object({ id: z.string().uuid() }), "params"),
  validate(updateUserSchema, "body"),
  async (req, res) => {
    const { id } = req.params;
    const { email, role, status } = req.body;
    logger.info(id, "Updating user");
    const user = await updateUser(id!, { email, role, status });

    res.json(user);
  }
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await deleteUser(id);

  res.json(user);
});

export default router;
