import mongoose from "mongoose";

const folderSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // TODO: rename to name
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
  },
  {
    timestamps: true,
  },
);

// folderSchema.add({
//   folders: [folderSchema],
// });

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
