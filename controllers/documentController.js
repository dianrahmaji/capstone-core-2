import asyncHandler from "express-async-handler";
import Contribution from "../models/contributionModel.js";
import Document from "../models/documentModel.js";
import Folder from "../models/folderModel.js";

// @desc Create Document
// @route POST /api/document
// @access Private/User
const createDocument = asyncHandler(async (req, res) => {
  const {
    folderId,
    repositoryId,
    contributions: contributionsRequestBody,
    ...rest
  } = req.body;

  const [document, ...contributions] = await Promise.all([
    Document.create({
      authors: contributionsRequestBody.map(({ author }) => author),
      ...rest,
    }),
    ...contributionsRequestBody.map((contribution) =>
      Contribution.create({
        ...contribution,
        repository: repositoryId,
      }),
    ),
  ]);

  document.contributions = contributions.map((c) => c._id);
  contributions.forEach((c) => {
    // eslint-disable-next-line no-param-reassign
    c.document = document;
  });

  const [updatedDocument] = await Promise.all([
    document.save(),
    Folder.findByIdAndUpdate(folderId, {
      $push: {
        documents: document._id,
      },
    }),
    ...contributions.map((c) => c.save()),
  ]);

  const response = await updatedDocument.populate({
    path: "contributions",
    select: ["_id", "contribution"],
    populate: {
      path: "author",
      select: ["_id", "fullName", "email"],
    },
  });

  res.status(201).json(response);
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
