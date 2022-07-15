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

export { createFolder }
