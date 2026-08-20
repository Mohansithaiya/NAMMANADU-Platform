import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  constituency_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Constituency",
  },
  complaint_title: {
    type: String,
    required: [true, "Complaint title is required"],
    trim: true,
    maxlength: 200,
  },
  complaint_description: {
    type: String,
    required: [true, "Complaint description is required"],
    maxlength: 2000,
  },
  AI_generated_format: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    enum: ["sanitation", "water", "roads", "electricity", "streetlights", "drainage", "other"],
    default: "other",
  },
  uploaded_images: [{
    type: String,
  }],
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  complaint_status: {
    type: String,
    enum: ["submitted", "under_verification", "assigned", "in_progress", "resolved"],
    default: "submitted",
  },
  assigned_worker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  verification_status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

complaintSchema.index({ location: "2dsphere" });

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
