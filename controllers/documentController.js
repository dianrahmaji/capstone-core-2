import asyncHandler from "express-async-handler";
import Document from "../models/documentModel.js";
import Folder from "../models/folderModel.js";

// @desc Create Document
// @route POST /api/document
// @access Private/User
const createDocument = asyncHandler(async (req, res) => {
  const { folderId, authorId, ...rest } = req.body;

  const document = await Document.create({
    authors: [authorId],
    ...rest,
  });

  await Folder.findByIdAndUpdate(folderId, {
    $push: {
      documents: document._id,
    },
  });

  res.status(201).json(document);
});

// @desc Get Document by Id
// @route GET /api/document/:id
// @access Private/User
const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  res.status(200).json(document);
});

// @desc Delete Document by Id
// @route DELETE /api/document/:id
// @access Private/User
const deleteDocument = asyncHandler(async (req, res) => {
  await Document.findByIdAndDelete(req.params.id);

  res.send(201).json({ message: "Document has been deleted" });
});

// @desc Update Document By Id
// @route PUT /api/document/:id
// @access Private/User
const updateDocument = asyncHandler(async (req, res) => {
  const payload = req.body;

  const document = await Document.findByIdAndUpdate(req.params.id, payload, {
    new: true,
  }).populate({
    path: "authors",
    select: ["fullName", "email"],
  });

  res.status(200).json(document);
});

export { createDocument, getDocumentById, deleteDocument, updateDocument };
