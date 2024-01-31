const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

exports.accessChat=asyncHandler(async(req,res)=>{
const {userId}=req.body
if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var existChat=await Chat.find({
    isGroupChat:false,
    $and:[
        {users:{$elemMatch:{$eq:userId}}},
        {users:{$elemMatch:{$eq:req.user.id}}}
    ]
}).populate("users","-password").populate("latestMessage") 
// }).populate("users","-password")

  // console.log(existChat,"existChat-2")
if (existChat.length > 0) { 
  // if (existChat) {
    res.send(existChat[0]);
  }
  else{
    console.log("new chat created");
    var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user.id, userId],
      };
try {
    var createdChat = await Chat.create(chatData);
      // const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      //   "users",
      //   "-password"
      // );
       createdChat = await createdChat.populate(
        "users",
        "-password"
      );
      
      // console.log(createdChat);
      res.status(200).json(createdChat); 
     
} catch (error) {
    res.status(400);
    throw new Error(error.message);
}
   
  }
})

exports.fetchChats=asyncHandler(async(req,res)=>{
//  console.log("hell")
    try {
        var allchats=await Chat.find({users:{$elemMatch:{$eq:req.user.id}}}).populate("users","-password").populate("groupAdmin", "-password")
        .populate("latestMessage").populate("latestMessage.sender")
        .sort({ updatedAt: -1 })
        console.log(allchats)
        allchats = await User.populate(allchats, {
          path: "latestMessage.sender",
          select: "name",
        });
         console.log(allchats)
        res.json(allchats)
    } catch (error) {
        res.status(400);
    throw new Error(error.message);
    }
    

})


exports.createGroupChat=asyncHandler(async(req,res)=>{
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }
    console.log("grup chat",req.body);
      var users = JSON.parse(req.body.users);
    //var users = req.body.users
      if (users.length < 2) {
        return res
          .status(400)
          .send("More than 2 users are required to form a group chat");
      }
    
      users.push(req.user.id);

      try {
        const groupChat = await Chat.create({
          chatName: req.body.name,
          users: users,
          isGroupChat: true,
          groupAdmin: req.user.id,
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
    
        res.status(200).json(fullGroupChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
})


exports.renameGroup=asyncHandler(async(req,res)=>{
const {chatId,chatName}=req.body;
try {
    const updatedchat=await Chat.findOneAndUpdate({_id:chatId}, {chatName}, {
        new: true,
      }) .populate("users", "-password")
      .populate("groupAdmin", "-password")

    if (!updatedchat) {
        res.status(404);
        throw new Error("Chat Not Found");
      } else {
        res.json(updatedchat);
      }
} catch (error) {
    res.status(400);
    throw new Error(error.message);
}

})


exports.removeFromGroup=asyncHandler(async(req,res)=>{
    const { chatId, userId } = req.body;

    // check if the requester is admin
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
})


exports.addToGroup=asyncHandler(async(req,res)=>{
    const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
})