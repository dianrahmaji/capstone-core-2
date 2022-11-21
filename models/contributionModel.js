import mongoose from "mongoose";

const contributionSchema = mongoose.Schema({
  repository: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repository",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },
  contribution: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Contribution = mongoose.model("Contribution", contributionSchema);

export default Contribution;
