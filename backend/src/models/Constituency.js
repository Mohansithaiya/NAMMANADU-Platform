import mongoose from "mongoose";

const constituencySchema = new mongoose.Schema({
  constituency_name: {
    type: String,
    required: [true, "Constituency name is required"],
    trim: true,
  },
  district: {
    type: String,
    required: [true, "District is required"],
    trim: true,
  },
  assigned_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  active_complaints: {
    type: Number,
    default: 0,
  },
  resolved_complaints: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Constituency = mongoose.model("Constituency", constituencySchema);
export default Constituency;
