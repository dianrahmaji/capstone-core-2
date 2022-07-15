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

// @desc Update Folder by Id
// @route PUT /api/folder/:id
// @access Private/User
const updateFolder = asyncHandler(async (req, res) => {
  const folder = await Folder.findById(req.params.id)
  const { title, description } = req.body

  if (!folder) {
    res.status(404)
    throw new Error('Folder not found')
  }

  folder.title = title
  folder.description = description

  const updatedFolder = await folder.save()
  res.status(200).json(updatedFolder)
})

export { createFolder, getAllChildrenById, updateFolder }
