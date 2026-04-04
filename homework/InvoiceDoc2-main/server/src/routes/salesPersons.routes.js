import { Router } from "express";
import { 
  handleList, 
  handleGetById, 
  handleCreate, 
  handleUpdate 
} from "../controllers/salesPersons.controller.js";

const router = Router();
router.get("/", handleList);
router.get("/:id", handleGetById);
router.post("/", handleCreate);
router.put("/:id", handleUpdate);

export default router;
