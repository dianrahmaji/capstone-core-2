import asyncHandler from "express-async-handler";
import Document from "../models/documentModel.js";
import Folder from "../models/folderModel.js";

// @desc Create Folder
// @route POST /api/folder
// @access Private/User
const createFolder = asyncHandler(async (req, res) => {
  const { parentId, title, note, authorId } = req.body;

  const folder = await Folder.create({
    title: title ?? "root",
    note,
    author: authorId,
  });

  folder.save();

  if (parentId) {
    Folder.findByIdAndUpdate(parentId, {
      $push: {
        folders: folder._id,
      },
    });
  }

  res.status(201).json(folder);
});

/**
 * @desc Get Current Folder By Id
 *  @route GET /api/folder/:id
 *  @access Private/User
 */
const getFolderById = asyncHandler(async (req, res) => {
  const folder = await Folder.findById(req.params.id)
    .populate({
      path: "folders",
      select: [
        "name",
        "description",
        "status",
        "createdAt",
        "updatedAt",
        "authors",
      ],
      populate: { path: "authors", select: ["fullName", "email"] },
    })
    .populate({ path: "authors", select: ["fullName", "email"] })
    .populate({
      path: "documents",
      populate: { path: "authors", select: ["fullName", "email"] },
    });

  res.status(200).json(folder);
});

// @desc Update Folder by Id
// @route PUT /api/folder/:id
// @access Private/User
const updateFolder = asyncHandler(async (req, res) => {
  const folder = await Folder.findById(req.params.id);

  if (!folder) {
    res.status(404);
    throw new Error("Folder not found");
  }

  const { title, description } = req.body;

  folder.title = title;
  folder.description = description;

  const updatedFolder = await folder.save();
  res.status(200).json(updatedFolder);
});

// @desc Delete Folder by Id
// @route DELETE /api/folder/:id
// @access Private/User
const deleteFolder = asyncHandler(async (req, res) => {
  const folder = await Folder.findById(req.params.id)
    .populate("folders", "_id")
    .populate("documents", "_id")
    .exec();

  Document.deleteMany({
    _id: {
      $in: folder.documents.map((d) => d._id),
    },
  });

  Folder.deleteMany({
    _id: {
      $in: [req.params.id, ...folder.folders.map((f) => f._id)],
    },
  });

  res.status(204).json({ message: "Folder deleted successfully" });
});

export { createFolder, getFolderById, updateFolder, deleteFolder };
