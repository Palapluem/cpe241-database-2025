import { Router } from "express";
import { getConfiguration } from "../controllers/configurations.controller.js";

const router = Router();

router.get("/", getConfiguration);

export default router;