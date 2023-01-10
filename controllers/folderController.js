import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

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
    parent: parentId,
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
  const folder = await Folder.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
    {
      $graphLookup: {
        from: "folders",
        startWith: "$parent",
        connectFromField: "parent",
        connectToField: "_id",
        depthField: "level",
        as: "parents",
      },
    },
    /** Authors */
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "authors",
        as: "authors",
      },
    },
    /** Repository */
    {
      $lookup: {
        from: "repositories",
        foreignField: "root",
        localField: "_id",
        as: "repositories",
      },
    },
    /** Folders */
    {
      $lookup: {
        from: "folders",
        let: { folders: "$folders" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$folders"] } } },
          {
            $lookup: {
              from: "users",
              let: { authors: "$authors" },
              pipeline: [{ $match: { $expr: { $in: ["$_id", "$$authors"] } } }],
              as: "authors",
            },
          },
          {
            $lookup: {
              from: "documents",
              let: { documents: "$documents" },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$documents"] } } },
              ],
              as: "documents",
            },
          },
        ],
        as: "folders",
      },
    },
    /** Documents */
    {
      $lookup: {
        from: "documents",
        let: { documents: "$documents" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$documents"] } } },
          {
            $lookup: {
              from: "users",
              let: { authors: "$authors" },
              pipeline: [{ $match: { $expr: { $in: ["$_id", "$$authors"] } } }],
              as: "authors",
            },
          },
          {
            $lookup: {
              from: "contributions",
              let: { contributions: "$contributions" },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$contributions"] } } },
                {
                  $lookup: {
                    from: "users",
                    let: { author: "$author" },
                    pipeline: [
                      { $match: { $expr: { $eq: ["$_id", "$$author"] } } },
                    ],
                    as: "author",
                  },
                },
                {
                  $unwind: {
                    path: "$author",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
              as: "contributions",
            },
          },
        ],
        as: "documents",
      },
    },
    {
      $project: {
        name: 1,
        note: 1,
        description: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,

        "repositories._id": 1,
        "repositories.title": 1,

        "parents._id": 1,
        "parents.name": 1,
        "parents.level": 1,

        "authors._id": 1,
        "authors.email": 1,
        "authors.fullName": 1,

        "folders._id": 1,
        "folders.name": 1,
        "folders.description": 1,
        "folders.status": 1,
        "folders.createdAt": 1,
        "folders.updatedAt": 1,
        "folders.authors._id": 1,
        "folders.authors.email": 1,
        "folders.authors.fullName": 1,
        "folders.documents._id": 1,
        "folders.documents.name": 1,
        "folders.documents.url": 1,
        "folders.documents.extension": 1,

        "documents._id": 1,
        "documents.name": 1,
        "documents.description": 1,
        "documents.extension": 1,
        "documents.size": 1,
        "documents.status": 1,
        "documents.url": 1,
        "documents.storageDir": 1,
        "documents.createdAt": 1,
        "documents.updatedAt": 1,
        "documents.authors._id": 1,
        "documents.authors.email": 1,
        "documents.authors.fullName": 1,
        "documents.contributions._id": 1,
        "documents.contributions.author._id": 1,
        "documents.contributions.author.email": 1,
        "documents.contributions.author.fullName": 1,
        "documents.contributions.contribution": 1,
      },
    },
  ]);

  if (!folder[0]) {
    res.status(404);
    throw new Error("Folder not found");
  }

  res.status(200).json(folder[0]);
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

/**
 * @desc Delete Folder by Id
 * @route DELETE /api/folder/:id
 * @access Private/User
 */
const deleteFolder = asyncHandler(async (req, res) => {
  const folder = await Folder.findById(req.params.id)
    .populate("folders", "_id")
    .populate("documents", "_id")
    .exec();

  await Document.deleteMany({
    _id: folder.documents,
  });

  await Folder.deleteMany({
    _id: [req.params.id, ...folder.folders],
  });

  res.status(204).json({ message: "Folder deleted successfully" });
});

const getFolderByDocumentId = asyncHandler(async (req, res) => {
  const folder = await Folder.aggregate([
    { $match: { documents: mongoose.Types.ObjectId(req.params.id) } },
    {
      $graphLookup: {
        from: "folders",
        startWith: "$parent",
        connectFromField: "parent",
        connectToField: "_id",
        depthField: "level",
        as: "parents",
      },
    },
    /** Authors */
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "authors",
        as: "authors",
      },
    },
    /** Folders */
    {
      $lookup: {
        from: "folders",
        let: { folders: "$folders" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$folders"] } } },
          {
            $lookup: {
              from: "users",
              let: { authors: "$authors" },
              pipeline: [{ $match: { $expr: { $in: ["$_id", "$$authors"] } } }],
              as: "authors",
            },
          },
        ],
        as: "folders",
      },
    },
    /** Documents */
    {
      $lookup: {
        from: "documents",
        let: { documents: "$documents" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$documents"] } } },
          {
            $lookup: {
              from: "users",
              let: { authors: "$authors" },
              pipeline: [{ $match: { $expr: { $in: ["$_id", "$$authors"] } } }],
              as: "authors",
            },
          },
          {
            $lookup: {
              from: "contributions",
              let: { contributions: "$contributions" },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$contributions"] } } },
                {
                  $lookup: {
                    from: "users",
                    let: { author: "$author" },
                    pipeline: [
                      { $match: { $expr: { $eq: ["$_id", "$$author"] } } },
                    ],
                    as: "author",
                  },
                },
                {
                  $unwind: {
                    path: "$author",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ],
              as: "contributions",
            },
          },
        ],
        as: "documents",
      },
    },
    {
      $project: {
        name: 1,
        note: 1,
        description: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,

        "parents._id": 1,
        "parents.name": 1,
        "parents.level": 1,

        "authors._id": 1,
        "authors.email": 1,
        "authors.fullName": 1,

        "folders._id": 1,
        "folders.name": 1,
        "folders.description": 1,
        "folders.status": 1,
        "folders.createdAt": 1,
        "folders.updatedAt": 1,
        "folders.authors._id": 1,
        "folders.authors.email": 1,
        "folders.authors.fullName": 1,

        "documents._id": 1,
        "documents.name": 1,
        "documents.description": 1,
        "documents.extension": 1,
        "documents.size": 1,
        "documents.status": 1,
        "documents.url": 1,
        "documents.storageDir": 1,
        "documents.createdAt": 1,
        "documents.updatedAt": 1,
        "documents.authors._id": 1,
        "documents.authors.email": 1,
        "documents.authors.fullName": 1,
        "documents.contributions._id": 1,
        "documents.contributions.author._id": 1,
        "documents.contributions.author.email": 1,
        "documents.contributions.author.fullName": 1,
        "documents.contributions.contribution": 1,
      },
    },
  ]);

  if (!folder[0]) {
    res.status(404);
    throw new Error("Folder not found");
  }

  res.status(200).json(folder[0]);
});

export {
  createFolder,
  getFolderById,
  updateFolder,
  updateFolderNote,
  deleteFolder,
  getFolderByDocumentId,
};
