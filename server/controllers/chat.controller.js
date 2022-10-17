import Chats from "../models/chat.model.js";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

export const accessChats = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("User ID not Found");
    res.sendStatus(400);
  }
  let isChat = await Chats.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chats.create(chatData);
      const FullChat = await Chats.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (Err) {
      res.status(400);
      throw new Error(Err.message);
    }
  }
});

export const fetchAllChats = asyncHandler(async (req, res) => {
  Chats.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      res.status(200).send(results);
    });
});

export const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send("Please Fill All The Fields");
  }

  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    res.status(400).send("More Than 2 Users Are Required For A Group Chat");
  }
  users.push(req.user);
  try {
    const groupChat = await Chats.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chats.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullGroupChat);
  } catch (error) {
    throw new Error(error.message);
  }
});

export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const chatUpdate = await Chats.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chatUpdate) {
    res.status(400);
    throw new Error("Chat Not Found");
  } else {
    res.json(chatUpdate);
  }
});

export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chats.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(400);
    throw new Error("User Not Found");
  } else {
    res.send(added);
  }
});

export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const remove = await Chats.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!remove) {
    res.status(400);
    throw new Error("User Not Found");
  } else {
    res.send(remove);
  }
});

export const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const remove = await Chats.findByIdAndDelete(chatId);

  if (!remove) {
    res.status(400);
    throw new Error("User Not Found");
  } else {
    res.send("removed chat");
  }
});
