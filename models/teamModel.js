import mongoose from 'mongoose'

const teamSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ['accepted', 'pending', 'rejected', 'updated'],
      default: 'pending'
    },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repository'
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    administrator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
)

const Team = mongoose.model('Team', teamSchema)

export default Team
