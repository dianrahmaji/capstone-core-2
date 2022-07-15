import asyncHandler from 'express-async-handler'
import Document from '../models/documentModel'
import Folder from '../models/folderModel'

// @desc Create Document
// @route POST /api/document
// @access Private/User
const createDocument = asyncHandler(async (req, res) => {
  const {
    parentId,
    title,
    description,
    type,
    link = 'http://example.com/',
    authorId
  } = req.body

  const document = await Document.create({
    title,
    description,
    type,
    link,
    author: authorId
  })

  Folder.findByIdAndUpdate(parentId, {
    $push: {
      documents: document._id
    }
  })

  res.status(201).json(document)
})

// @desc Get Document by Id
// @route GET /api/document/:id
// @access Private/User
const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id)

  res.status(200).json(document)
})

// @desc Delete Document by Id
// @route DELETE /api/document/:id
// @access Private/User
const deleteDocument = asyncHandler(async (req, res) => {
  Document.findByIdAndDelete(req.params.id)

  res.send(201).json({ message: 'Document has been deleted' })
})

export { createDocument, getDocumentById, deleteDocument }
