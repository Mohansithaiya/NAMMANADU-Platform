import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  points_earned: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  issued_at: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Reward = mongoose.model("Reward", rewardSchema);
export default Reward;
