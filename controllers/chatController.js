import asyncHandler from 'express-async-handler'
import Chat from '../models/chatModel.js'

/**
 * @desc Get All Messages
 * @route GET /api/chat/:id
 * @access Private/User
 */
const getAllMessages = asyncHandler(async (req, res) => {
  const { id } = req.params

  const { messages } = await Chat.findById(id).populate({
    path: 'messages',
    populate: {
      path: 'sender',
      select: ['fullName']
    }
  })

  res.status(200).json(messages)
})

export { getAllMessages }
