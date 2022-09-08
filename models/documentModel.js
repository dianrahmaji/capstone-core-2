import mongoose from "mongoose";

const documentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      required: true,
      enum: ["jpg", "pdf", "mp4", "docx", "xlsx"], // TODO: Add more types later
    },
    size: { type: Number, required: true }, // in Bytes
    link: { type: String, required: true },
    craftingTime: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["ongoing", "draft", "done", "critical"],
      default: "ongoing",
    },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
