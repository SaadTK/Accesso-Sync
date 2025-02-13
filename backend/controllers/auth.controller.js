import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

//storing the tokens in redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 // 7 days
  );
};

//setCookie function
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

//////////////////////////////// signup controller
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json("User already exists.");
    }

    const user = await User.create({ name, email, password });

    // authintication token
    const { accessToken, refreshToken } = generateTokens(user._id);

    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////  login controller
export const login = async (req, res) => {
  res.send("login is called.");
};

//logout controller
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: "No refresh token found in cookies." });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const redisKey = `refreshToken:${decoded.userId}`;

    // Debug: Check if the key exists before deleting
    const storedToken = await redis.get(redisKey);
    if (!storedToken) {
      console.log(
        `No refresh token found in Redis for user: ${decoded.userId}`
      );
    } else {
      console.log(`Deleting token for user: ${decoded.userId}`);
      const deleteResult = await redis.del(redisKey);
      console.log(`Delete result: ${deleteResult}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged Out Successfully." });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
