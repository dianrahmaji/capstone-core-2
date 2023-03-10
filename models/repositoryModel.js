import mongoose from "mongoose";

const repositorySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    root: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
  },
  { timestamps: true },
);

repositorySchema.index({ title: "text" });

const Repository = mongoose.model("Repository", repositorySchema);

export default Repository;

// Many to Many https://www.bezkoder.com/mongodb-many-to-many-mongoose/
