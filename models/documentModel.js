import mongoose from 'mongoose'

const documentSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    // TODO: add document type enums
    type: { type: String, required: true },
    link: { type: String, required: true },
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true
  }
)

const Document = mongoose.model('Document', documentSchema)

export default Document
