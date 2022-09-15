import mongoose from "mongoose";

const folderSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    note: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      required: true,
      enum: ["ongoing", "draft", "done", "critical"],
      default: "ongoing",
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
  },
  {
    timestamps: true,
  },
);

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
