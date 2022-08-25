/* eslint-disable no-console */
import { Server } from "socket.io";
import minimist from "minimist";

import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export default function createSocketServer(app) {
  const io = new Server(app, {
    pingTimeout: 60000,
    cors: {
      origin: [
        "http://localhost:3000", // admin dev
        "http://localhost:3030", // admin prod
        "http://localhost:8000", // dashboard dev
        "http://localhost:8080", // dashboard drod
        minimist(process.argv.slice(2)).ngrok, // dashboard drod with ngrok (randomized). Change every run
      ],
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log("User joins", roomId);
      socket.emit("joined_room");
    });

    socket.on("send_message", async (roomId, { text, sender }) => {
      const message = await Message.create({ text, sender });
      await Chat.findByIdAndUpdate(roomId, {
        $push: {
          // eslint-disable-next-line no-underscore-dangle
          messages: message._id,
        },
      });

      socket.broadcast.to(roomId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log("disconected");
    });
  });
}
