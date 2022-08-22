import { Server } from 'socket.io'

import Chat from '../models/chatModel.js'
import Message from '../models/messageModel.js'

export const createSocketServer = app => {
  const io = new Server(app, {
    pingTimeout: 60000,
    cors: {
      origin: 'http://localhost:8000'
    }
  })

  io.on('connection', socket => {
    console.log('Connected to socket.io')

    socket.on('join_room', roomId => {
      socket.join(roomId)
      console.log('User joins', roomId)
      socket.emit('joined_room')
    })

    socket.on('send_message', async (roomId, { text, sender }) => {
      const message = await Message.create({ text, sender })
      await Chat.findByIdAndUpdate(roomId, {
        $push: {
          message: message._id
        }
      })

      socket.broadcast.to(roomId).emit('receive_message', message)
    })

    socket.on('disconnect', () => {
      console.log('disconected')
    })
  })
}
