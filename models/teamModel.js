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
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
    },
    administrator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
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

const Team = mongoose.model("Team", teamSchema);

export default Team;
