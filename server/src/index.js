import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import "./db/database.js";
import transactionRoutes from "./routes/transactions.js";
import budgetRoutes from "./routes/budgets.js";
import analyticsRoutes from "./routes/analytics.js";
import categoryRoutes from "./routes/categories.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "50kb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60000, max: 180 }));

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", app: "SpendWise API" })
);

app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/categories", categoryRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`SpendWise API running on port ${PORT}`));
