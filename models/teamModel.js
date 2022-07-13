import mongoose from 'mongoose'

const teamSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    isApproved: { type: Boolean, required: true, default: false },
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repository'
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

const Team = mongoose.model('Team', teamSchema)

export default Team
