import Complaint from "../models/Complaint.js";
import { AppError } from "../middleware/errorHandler.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const STATUS_FILTER_OPTIONS = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
];

const generateTrackingId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `NMD-${timestamp}-${random}`;
};

const parsePositiveInteger = (value, fallback, fieldName, maximum) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new AppError(`${fieldName} must be a positive integer`, 400);
  }

  return maximum ? Math.min(parsed, maximum) : parsed;
};

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
    const page = parsePositiveInteger(
      req.query.page,
      DEFAULT_PAGE,
      "page"
    );
    const limit = parsePositiveInteger(
      req.query.limit,
      DEFAULT_LIMIT,
      "limit",
      MAX_LIMIT
    );
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim().slice(0, 200)
        : "";
    const status =
      typeof req.query.status === "string"
        ? req.query.status.trim().toLowerCase()
        : "";
    const category =
      typeof req.query.category === "string"
        ? req.query.category.trim().slice(0, 100)
        : "";

    if (status && !STATUS_FILTER_OPTIONS.includes(status)) {
      throw new AppError("Invalid complaint status filter", 400);
    }

    const ownershipFilter = { citizen: req.user._id };
    const complaintFilter = { ...ownershipFilter };

    if (search) {
      const searchRegex = {
        $regex: escapeRegex(search),
        $options: "i",
      };
      complaintFilter.$or = [
        { tracking_id: searchRegex },
        { title: searchRegex },
        { category: searchRegex },
      ];
    }

    if (status) {
      complaintFilter.status = status;
    }

    if (category) {
      complaintFilter.category = category;
    }

    const [total, totalComplaints, submitted, inProgress, resolved, categories] =
      await Promise.all([
        Complaint.countDocuments(complaintFilter),
        Complaint.countDocuments(ownershipFilter),
        Complaint.countDocuments({ ...ownershipFilter, status: "submitted" }),
        Complaint.countDocuments({ ...ownershipFilter, status: "in_progress" }),
        Complaint.countDocuments({ ...ownershipFilter, status: "resolved" }),
        Complaint.distinct("category", ownershipFilter),
      ]);

    const pages = total > 0 ? Math.ceil(total / limit) : 0;
    const currentPage = pages > 0 ? Math.min(page, pages) : DEFAULT_PAGE;
    const skip = (currentPage - 1) * limit;

    const complaints = await Complaint.find(complaintFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        complaints,
        pagination: {
          total,
          page: currentPage,
          pages,
          limit,
        },
        statistics: {
          total: totalComplaints,
          submitted,
          inProgress,
          resolved,
        },
        categories: categories.filter(Boolean).sort((first, second) =>
          first.localeCompare(second)
        ),
      },
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
