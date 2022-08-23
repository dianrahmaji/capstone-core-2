import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

/**
 * @desc Get Notifications By MemberId and RoomId
 * @route GET /api/notification/:roomId/member/:memberId
 * @access Private/User
 */
const getNotificationById = asyncHandler(async (req, res) => {
  const { roomId, memberId } = req.params;

  const chat = await Chat.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(roomId) } },
    {
      $lookup: {
        from: "messages",
        localField: "messages",
        foreignField: "_id",
        as: "messages",
      },
    },
    { $project: { _id: 0, messages: 1 } },
    { $unwind: "$messages" },
    {
      $replaceRoot: { newRoot: "$messages" },
    },
    {
      $match: {
        $and: [
          { sender: { $ne: mongoose.Types.ObjectId(memberId) } },
          { readBy: { $nin: [mongoose.Types.ObjectId(memberId)] } },
        ],
      },
    },
    { $count: "unread_messages" },
  ]).exec();

  const response = {
    unread_messages: chat[0]?.unread_messages || 0,
  };

  res.status(200).json(response);
});

/**
 * @desc Reset Notification By MemberId and RoomId
 * @route PUT /api/notification/:roomId/member/:memberId
 * @access Private/User
 */
const resetNotificationById = asyncHandler(async (req, res) => {
  const { roomId, memberId } = req.params;

  await Message.updateMany(
    {
      chat: { $eq: roomId },
      sender: { $ne: memberId },
      readBy: {
        $nin: [memberId],
      },
    },
    {
      $push: {
        readBy: memberId,
      },
    },
    { multi: true },
  ).exec();

  res.status(200).json({ message: "all chats marked as read" });
});

export { getNotificationById, resetNotificationById };
