import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc Auth admin & get token
// @route POST /api/admin/login
// @access Private
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.matchPassword(password)) {
    if (!user.isAdmin) {
      res.status(403);
      throw new Error("Access forbidden");
    }

    res.json({
      _id: user._id,
      accountType: user.accountType,
      email: user.email,
      faculty: user.faculty,
      fullName: user.fullName,
      major: user.major,
      userId: user.userId,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export { authAdmin };
