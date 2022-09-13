import mongoose from "mongoose";

const documentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    extension: {
      type: String,
      required: true,
      enum: ["jpg", "pdf", "mp4", "docx", "xlsx", "txt"], // TODO: Add more types later
    },
    size: { type: Number, required: true }, // in Bytes
    url: { type: String, required: true },
    craftingTime: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["ongoing", "draft", "done", "critical"],
      default: "ongoing",
    },
    storageDir: {
      type: String,
      required: true,
    },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
