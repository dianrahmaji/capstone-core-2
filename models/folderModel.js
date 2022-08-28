import mongoose from "mongoose";

const folderSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    note: { type: String, required: true },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

folderSchema.add({
  folders: [folderSchema],
});

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
