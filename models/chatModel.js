import mongoose from 'mongoose'

const chatSchema = mongoose.Schema(
  {
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
      }
    ]
  },
  {
    timestamps: true
  }
)

const Chat = mongoose.model('Chat', chatSchema)

export default Chat
