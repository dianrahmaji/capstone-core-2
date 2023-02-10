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
        minimist(process.argv.slice(2)).ngrok, // dashboard prod with ngrok (randomized). Change every run
        "https://capstone-admin.vercel.app", // admin vercel
        "https://capstone-dashboard-beta.vercel.app", // dashboard vercel
      ],
    },
  });

  io.on("connection", (socket) => {
    socket.removeAllListeners();
    console.log("Connected to socket.io");

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log("User joins", roomId);
      socket.emit("joined_room");
    });

    socket.on("send_message", async (roomId, { body, sender, type, url }) => {
      const message = await Message.create({ body, sender, type, url });
      console.log(message);
      await Chat.findByIdAndUpdate(roomId, {
        $push: {
          messages: message._id,
        },
      });

      console.log("members in", roomId);
      io.in(roomId)
        .allSockets()
        .then((members) => console.log(members));
      socket.to(roomId).emit("receive_message", [message]);
    });

    socket.on("disconnect", () => {
      console.log("disconected");
    });
  });
}
