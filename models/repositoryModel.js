import mongoose from "mongoose";

const repositorySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
  },
  { timestamps: true },
);

const Repository = mongoose.model("Repository", repositorySchema);

export default Repository;

// Many to Many https://www.bezkoder.com/mongodb-many-to-many-mongoose/
