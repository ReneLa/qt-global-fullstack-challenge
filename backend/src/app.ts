import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { errorHandler } from "./middlewares/error-handler.js";
import usersRouter from "./routes/users.js";
import { initializeKeys } from "./utils/user-signing.js";

dotenv.config();

initializeKeys();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("API server is running");
});

// Error handler must be last
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
