import { Router } from "express";
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
} from "../controllers/complaintController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { uploadComplaintAttachments } from "../middleware/upload.js";

const router = Router();

router.use(authenticate);
router.use(authorize("citizen"));

router.post("/", uploadComplaintAttachments, createComplaint);
router.get("/", getMyComplaints);
router.get("/:id", getComplaintById);

export default router;