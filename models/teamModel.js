import mongoose from 'mongoose'

const teamSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
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
