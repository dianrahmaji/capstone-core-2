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
    status: {
      type: String,
      required: true,
      enum: ["ongoing", "draft", "done"],
      default: "ongoing",
    },
    version: {
      type: String,
      required: true,
      default: 1,
    },
    storageDir: {
      type: String,
      required: true,
    },
    contributions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contribution",
      },
    ],
    references: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
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
