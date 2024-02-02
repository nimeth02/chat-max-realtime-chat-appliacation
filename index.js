const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config()
const app = express();
app.use(express.json());
connectDB()

const userRouter=require('./routers/userRouter');
const chatRouter=require('./routers/chatRouter');
const messageRouter=require('./routers/messageRouter');
const { notFound, errorHandler } = require("./middleware/errorHandler");
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running.")
  });
}


app.use(notFound);
app.use(errorHandler);





const PORT = process.env.PORT || 3002

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io=require("socket.io")(server,{
  pingTimeout: 60000,
  cors: {
   origin: ["http://localhost:3000",'https://chatmax.onrender.com']
    // credentials: true,
  },

})

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    console.log(userData);
    if(userData){
    socket.join(userData._id);
    console.log(userData._id)
    socket.emit("connected");
    }
  })

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined chat Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    console.log(newMessageRecieved,"new msg")
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved) return;
      console.log(user._id)
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  })
})
