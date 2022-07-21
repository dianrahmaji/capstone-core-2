import dotenv from 'dotenv'
import colors from 'colors'

import connectDB from '../config/db.js'

import Document from '../models/documentModel.js'
import Folder from '../models/folderModel.js'
import Message from '../models/messageModel.js'
import Repository from '../models/repositoryModel.js'
import Team from '../models/teamModel.js'
import User from '../models/userModel.js'

dotenv.config()

connectDB()

const destroyData = async () => {
  try {
    await Promise.all([
      Document.deleteMany({}),
      Folder.deleteMany({}),
      Message.deleteMany({}),
      Repository.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({})
    ])

    console.log('Data Destroyed!'.red)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
}
