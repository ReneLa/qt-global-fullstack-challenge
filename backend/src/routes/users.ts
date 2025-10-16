import express, { type Router } from "express";

import { createUser, deleteUser, getUsers, updateUser } from "../services/user-service.js";

const router: Router = express.Router();

router.post("/", async (req, res) => {
  const { email, role, status } = req.body;

  const user = await createUser({ email, role, status });

  res.json(user);
});

router.get("/", async (req, res) => {
  const users = await getUsers();

  return res.json(users);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, role, status } = req.body;

  const user = await updateUser(id, { email, role, status });

  res.json(user);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await deleteUser(id);

  res.json(user);
});

export default router;
