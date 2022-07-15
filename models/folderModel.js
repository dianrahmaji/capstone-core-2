import mongoose from 'mongoose'

const folderSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
      }
    ],
    folders: [this],
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true
  }
)

const Folder = mongoose.model('Folder', folderSchema)

export default Folder
