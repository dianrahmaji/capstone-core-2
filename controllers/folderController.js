import asyncHandler from "express-async-handler";
import Document from "../models/documentModel.js";
import Folder from "../models/folderModel.js";

// @desc Create Folder
// @route POST /api/folder
// @access Private/User
const createFolder = asyncHandler(async (req, res) => {
  const { authorId, description, name, parentId } = req.body;

  const note = `<h1>${name}</h1><p>Click the edit note button!</p>`;

  let folder = await Folder.create({
    name,
    note,
    description,
    authors: authorId,
  });

  await Folder.findByIdAndUpdate(parentId, {
    $push: {
      folders: folder._id,
    },
  });

  folder = await folder.populate({
    path: "authors",
    select: ["email", "fullName"],
  });

  res.status(201).json(folder);
});

/**
 * @desc Get Current Folder By Id
 * @route GET /api/folder/:id
 * @access Private/User
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

  const { name, status, description } = req.body;

  folder.name = name;
  folder.status = status;
  folder.description = description;

  const updatedFolder = await folder.save();
  res.status(200).json(updatedFolder);
});

/**
 * @desc Update Folder Note By Id
 * @route PUT /api/folder/:id/note
 * @access Private/User
 */
const updateFolderNote = asyncHandler(async (req, res) => {
  const { content, authorId } = req.body;

  const folder = await Folder.findByIdAndUpdate(
    req.params.id,
    {
      note: content,
      $addToSet: { authors: authorId },
    },
    { new: true },
  )
    .select(["note", "authors"])
    .populate({ path: "authors", select: ["fullName", "email"] });

  res.status(201).send(folder);
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

export {
  createFolder,
  getFolderById,
  updateFolder,
  updateFolderNote,
  deleteFolder,
};
