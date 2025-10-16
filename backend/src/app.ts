import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/users.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("API server is running");
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
