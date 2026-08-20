import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    select: false,
  },
  phone_number: {
    type: String,
    trim: true,
    default: "",
  },
  address: {
    type: String,
    trim: true,
    default: "",
  },
  district: {
    type: String,
    trim: true,
    default: "",
  },
  constituency: {
    type: String,
    trim: true,
    default: "",
  },
  role: {
    type: String,
    enum: ["citizen", "admin", "worker", "superadmin"],
    default: "citizen",
  },
  reward_points: {
    type: Number,
    default: 0,
  },
  trust_score: {
    type: Number,
    default: 50,
    min: 0,
    max: 100,
  },
  blacklist_status: {
    type: Boolean,
    default: false,
  },
  refresh_token: {
    type: String,
    select: false,
  },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refresh_token;
  delete obj.__v;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
