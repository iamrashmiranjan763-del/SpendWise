import { Router } from "express";
import { categories } from "../utils/validation.js";

const router = Router();
router.get("/", (req, res) => res.json(categories));
export default router;
