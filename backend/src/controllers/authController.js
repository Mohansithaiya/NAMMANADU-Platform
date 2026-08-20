import validator from "validator";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";
import { generateTokens } from "../middleware/auth.js";

export const signup = async (req, res, next) => {
  try {
    const { full_name, email, password, phone_number, district, constituency, role } = req.body;

    if (!full_name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }
    if (!validator.isEmail(email)) {
      throw new AppError("Invalid email format", 400);
    }
    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    const allowedRoles = ["citizen"];
    const userRole = allowedRoles.includes(role) ? role : "citizen";

    const user = await User.create({
      full_name,
      email,
      password,
      phone_number: phone_number || "",
      district: district || "",
      constituency: constituency || "",
      role: userRole,
    });

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refresh_token = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.blacklist_status) {
      throw new AppError("Account has been suspended", 403);
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refresh_token = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: { user, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new AppError("Refresh token required", 401);

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refresh_token");
    if (!user || user.refresh_token !== token) {
      throw new AppError("Invalid refresh token", 401);
    }

    const tokens = generateTokens(user._id);

    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+refresh_token");
    if (user) {
      user.refresh_token = undefined;
      await user.save();
    }

    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
};
