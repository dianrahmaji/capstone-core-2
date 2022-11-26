import mongoose from "mongoose";

const documentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    extension: {
      type: String,
      required: true,
    },
    size: { type: Number, required: true }, // in Bytes
    url: { type: String, required: true },
    // TODO: Remove this field
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
    // TODO: Remove this field
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    contributions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contribution",
      },
    ],
  },
  {
    timestamps: true,
  },
);

documentSchema.index({ name: "text", description: "text" });

const Document = mongoose.model("Document", documentSchema);

export default Document;
