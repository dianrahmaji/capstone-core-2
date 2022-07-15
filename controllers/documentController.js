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

export { createDocument }
