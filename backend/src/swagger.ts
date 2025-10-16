import { type Express } from "express";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function setupSwagger(app: Express) {
  const basePath = path.join(__dirname, "docs");

  const files = fs
    .readdirSync(basePath)
    .filter((file) => file.endsWith(".yaml"));
  const mergedDocs = files.map(
    (file) =>
      yaml.load(fs.readFileSync(path.join(basePath, file), "utf8")) as Record<
        string,
        any
      >
  );

  const mergedContent = mergedDocs.reduce((acc, doc) => {
    return { ...acc, ...doc };
  }, {});

  const swaggerDoc = {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "Mini admin panel backend API"
    },
    servers: [{ url: process.env.API_URL || "http://localhost:4000" }],
    ...mergedContent
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}
