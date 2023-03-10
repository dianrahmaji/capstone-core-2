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

  const response = await Document.aggregate([
    {
      $match: { _id: updatedDocument._id },
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
              pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$author"] } } }],
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
    {
      $lookup: {
        from: "documents",
        let: { references: "$references" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$references"],
              },
            },
          },
          {
            $lookup: {
              from: "folders",
              let: { id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ["$$id", "$documents"],
                    },
                  },
                },
                {
                  $graphLookup: {
                    from: "folders",
                    startWith: "$parent",
                    connectFromField: "parent",
                    connectToField: "_id",
                    depthField: "level",
                    as: "parent",
                  },
                },
              ],
              as: "folders",
            },
          },
          { $unwind: "$folders" },
        ],
        as: "references",
      },
    },
  ]);

  res.status(201).json(response[0]);
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
  const { contributions, ...payload } = req.body;
  console.log(payload);
  const documentId = req.params.id;

  const updatedContributions = (
    await Promise.all(
      contributions.map(({ author, contribution }) =>
        Contribution.findOneAndUpdate(
          { author, document: documentId },
          { contribution },
          { new: true, upsert: true },
        ),
      ),
    )
  ).map((c) => c._id);

  const document = await Document.findByIdAndUpdate(
    documentId,
    { ...payload, contributions: updatedContributions },
    {
      new: true,
    },
  );

  const response = await Document.aggregate([
    {
      $match: { _id: document._id },
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
              pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$author"] } } }],
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
    {
      $lookup: {
        from: "documents",
        let: { references: "$references" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$references"],
              },
            },
          },
          {
            $lookup: {
              from: "folders",
              let: { id: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ["$$id", "$documents"],
                    },
                  },
                },
                {
                  $graphLookup: {
                    from: "folders",
                    startWith: "$parent",
                    connectFromField: "parent",
                    connectToField: "_id",
                    depthField: "level",
                    as: "parent",
                  },
                },
              ],
              as: "folders",
            },
          },
          { $unwind: "$folders" },
        ],
        as: "references",
      },
    },
  ]);

  res.status(200).json(response[0]);
});

// @desc Get Document by String
// @route GET /api/document/:id
// @access Public
const getDocumentByString = asyncHandler(async (req, res) => {
  await Document.createIndexes({ name: "text", description: "text" });
  const { searchText } = req.query;

  const documents = await Document.aggregate([
    { $match: { $text: { $search: searchText } } },
    { $sort: { score: { $meta: "textScore" } } },
    {
      $lookup: {
        from: "folders",
        foreignField: "documents",
        localField: "_id",
        as: "folders",
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "authors",
        as: "authors",
      },
    },
    {
      $unwind: {
        path: "$folders",
      },
    },
    {
      $graphLookup: {
        from: "folders",
        startWith: "$folders.parent",
        connectFromField: "parent",
        connectToField: "_id",
        as: "folders.parent",
        depthField: "level",
      },
    },
  ]);

  res.status(200).json(documents);
});

export {
  createDocument,
  getDocumentById,
  deleteDocument,
  updateDocument,
  getDocumentByString,
};
