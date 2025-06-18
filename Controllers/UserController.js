const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const User = require("../Models/user.model");
const { generateToken, verifyToken } = require("../utils/AuthJWT");
const options = require("../Middleware/CookieMiddleware");

const app = require("../index");
app.use(cookieParser());

// Register
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  const username = email + "123";

  try {
    const existingUser = await User.findOne({ where: { email } });
    const encryptedPassword = await bcrypt.hash(password, 10);

    if (!existingUser) {
      const newUser = await User.create({
        username,
        email,
        password: encryptedPassword,
      });

      const token = generateToken(newUser);
      res
        .status(200)
        .cookie("token", token, options)
        .json({
          status: "ok",
          data: { message: "New User Registered", user: newUser, token },
        });
    } else {
      res.status(401).json({
        status: "error",
        data: { message: "Email Id already in use", user: existingUser },
      });
    }
  } catch (error) {
    res.status(501).json({
      status: "error",
      data: { message: "User not created", error },
    });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: "error",
        data: { message: "User not found" },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        data: { message: "Invalid credentials" },
      });
    }

    const token = generateToken(user);
    res
      .status(200)
      .cookie("token", token, options)
      .json({
        status: "ok",
        data: { message: "Login successful", user, token },
      });
  } catch (err) {
    res.status(501).json({
      status: "error",
      data: { message: "Server error", error: err },
    });
  }
};

// Logout
exports.logoutUser = async (req, res) => {
  res
    .status(200)
    .clearCookie("token")
    .json({
      status: "ok",
      data: { message: "Logout successful" },
    });
};

// Auth check
exports.authUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      status: "error",
      data: { message: "Access denied. No token." },
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      status: "error",
      data: { message: "Invalid or expired token" },
    });
  }

  res.status(200).json({
    status: "ok",
    data: { message: "Access granted" },
  });
};
