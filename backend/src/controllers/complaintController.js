import Complaint from "../models/Complaint.js";
import { AppError } from "../middleware/errorHandler.js";

const generateTrackingId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `NMD-${timestamp}-${random}`;
};

export const createComplaint = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      district,
      constituency,
      address,
      priority,
      attachments,
    } = req.body;

    if (!title || !description || !category || !district) {
      throw new AppError(
        "Title, description, category and district are required",
        400
      );
    }

    const complaint = await Complaint.create({
      tracking_id: generateTrackingId(),
      citizen: req.user._id,
      title,
      description,
      category,
      district,
      constituency: constituency || "",
      address: address || "",
      priority: priority || "medium",
      attachments: Array.isArray(attachments) ? attachments : [],
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({
      citizen: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { complaints },
    });
  } catch (error) {
    next(error);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      citizen: req.user._id,
    });

    if (!complaint) {
      throw new AppError("Complaint not found", 404);
    }

    res.json({
      success: true,
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};