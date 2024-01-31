const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messagesModel");

exports.sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user.id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        // message = await message.populate("sender", "name pic").execPopulate();
        // message = await message.populate("chat").execPopulate();
        // msg = await User.populate(msg, {
        //   path: "chat.users",
        //   select: "name pic email",
        // });

        var msg=await Message.findOne({_id:message._id}).populate("sender", "name pic").populate("chat").populate("chat.users");
        msg = await User.populate(msg, {
            path: "chat.users",
            select: "name pic email",
          });
  
        // console.log(message,msg)
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: msg });
    
        res.json(msg);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
})


exports.allMessages = asyncHandler(async (req,res) => {
    console.log(req.query)
    try {
        const allMessages = await Message.find({ chat: req.query.chatId }).populate("sender", "name pic email").populate("chat")
        res.json(allMessages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
   
})