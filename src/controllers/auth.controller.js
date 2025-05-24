// Importing necessary modules and models
import { User } from "../models/user.model.js";
import { auth } from "../utils/firebase.config.js";
import { generateJwt } from "../utils/jwt.js";

// Checking environment
const isProduction = process.env.NODE_ENV === "production";

export const signup = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res
        .status(400)
        .json({ success: false, message: "Token Not Provided" });
    }

    // Verify Firebase ID Token
    const decodedIdToken = await auth.verifyIdToken(idToken);

    if (!decodedIdToken) {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }

    // Extract user details from the token
    const { name, picture, email } = decodedIdToken;

    // Check if user exists in database
    let user = await User.findOne({ email }).populate("ideas");

    if (!user) {
      user = new User({ username: name, email, profilePicture: picture });
      await user.save();
      // Populate ideas after saving
      user = await User.findById(user._id).populate("ideas");
    }

    const token = generateJwt(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Sign Up Successful",
      user,
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// User logout controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : true,
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// User checkAuth controller
export const checkAuth = async (req, res) => {
  try {
    // Populate ideas for the authenticated user
    const user = await User.findById(req.user._id).populate("ideas");
    return res
      .status(200)
      .json({ success: true, message: "Authenticated", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
