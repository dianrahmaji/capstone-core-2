import asyncHandler from 'express-async-handler'
import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'

/**
 * @desc Send Message
 * @route POST /api/chat/:id
 * @access Private/User
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { text, sender } = req.body
  const { id } = req.params

  const message = await Message.create({ text, sender })
  await Chat.findByIdAndUpdate(id, {
    $push: {
      messages: message._id
    }
  })

  res.status(200).send({ message: 'message sent successfully' })
})

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

export { sendMessage, getAllMessages }
