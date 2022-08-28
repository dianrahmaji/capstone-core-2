import mongoose from "mongoose";

const documentSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    note: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["jpg", "pdf", "mp4", "docx", "xlsx"], // TODO: Add more types later
    },
    link: { type: String, required: true },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
