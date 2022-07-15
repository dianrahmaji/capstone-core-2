import asyncHandler from 'express-async-handler'
import Folder from '../models/folderModel.js'

// @desc Create Folder
// @route POST /api/folder
// @access Private/User
const createFolder = asyncHandler(async (req, res) => {
  const { parentId, title, description, authorId } = req.body

  const folder = await Folder.create({
    title: title ?? 'root',
    description,
    author: authorId
  })

  folder.save()

  if (parentId) {
    Folder.findByIdAndUpdate(parentId, {
      $push: {
        folders: folder._id
      }
    })
  }

  res.status(201).json(folder)
})

// @desc Get All Children from Folder by Folder Id
// @route GET /api/folder/:id
// @access Private/User
const getAllChildrenById = asyncHandler(async (req, res) => {
  const children = await Folder.findById(req.params.id)
    .populate({
      path: 'documents',
      select: ['_id', 'title']
    })
    .populate({
      path: 'folders',
      select: ['_id', 'title']
    })
    .populate({ path: 'authors', select: 'fullName' })
    .exec()

  res.status(200).json(children)
})

export { createFolder, getAllChildrenById }
