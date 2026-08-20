import mongoose from "mongoose";

const schemeEligibilitySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  income: {
    type: Number,
    default: 0,
  },
  occupation: {
    type: String,
    trim: true,
    default: "",
  },
  category: {
    type: String,
    enum: ["general", "obc", "sc", "st", "ews"],
    default: "general",
  },
  eligibility_status: {
    type: String,
    enum: ["pending", "eligible", "not_eligible"],
    default: "pending",
  },
  recommended_schemes: [{
    type: String,
  }],
  application_status: {
    type: String,
    enum: ["not_applied", "applied", "approved", "rejected"],
    default: "not_applied",
  },
}, { timestamps: true });

const SchemeEligibility = mongoose.model("SchemeEligibility", schemeEligibilitySchema);
export default SchemeEligibility;
