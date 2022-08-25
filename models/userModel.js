import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    faculty: { type: String, required: true },
    major: { type: String, required: true },
    accountType: { type: String, required: true },
    password: { type: String, required: true },
    isApproved: { type: Boolean, required: true, default: false },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  { timestamps: true },
);

// eslint-disable-next-line func-names
userSchema.methods.matchPassword = async function (enteredPassword) {
  const compared = await bcrypt.compare(enteredPassword, this.password);
  return compared;
};

// eslint-disable-next-line func-names
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
