import mongoose from "mongoose";

const teamSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["accepted", "pending", "rejected", "updated"],
      default: "pending",
      required: true,
    },
    topics: [
      {
        type: String,
        required: true,
      },
    ],
    description: { type: String, required: true },
    document: { type: String, required: true },
    review: { type: String, default: "" },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
    },
    administrators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true },
);

teamSchema.index({ name: "text", description: "text" });

const Team = mongoose.model("Team", teamSchema);

export default Team;
