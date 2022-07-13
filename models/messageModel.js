import mongoose from 'mongoose'

const messageSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

const Message = mongoose.model('Message', messageSchema)

export default Message
