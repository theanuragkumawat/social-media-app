import http from "http"
import { errorHandler } from "./middlewares/error.middleware.js";
import mongoose from "mongoose";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io"

const app = express();
const server = http.createServer(app)


//socket server
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
})

//store online users
export const userSocketMap = {}; // { databaseUserId: socketId }

//socket connection handler
io.on("connection",(socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected: ", userId);
  if(userId){
    userSocketMap[userId] = socket.id;
  }

  //emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    console.log("User disconnected: ", userId);
    if(userId){
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })

})

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser())

app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended:true, limit: "20kb"}))
app.use(express.static("public"))

app.get('/',(req,res) => {
  return res.status(200).json({text:"Hello World!"})
})

// routes import
import healthCheckRouter from "./routes/healthcheck.route.js"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import followRouter from "./routes/follow.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"
import storyRouter from "./routes/story.route.js"
import highlightRouter from "./routes/highlight.route.js"
import messageRouter from "./routes/message.route.js"

//Routes
app.use('/api/v1/healthcheck',healthCheckRouter);

//user routes
app.use('/api/v1/users',userRouter); //for give direction

//post routes
app.use('/api/v1/posts',postRouter)
app.use('/api/v1/users',postRouter)

//follow routes
app.use('/api/v1/users',followRouter)

//comment routes
app.use('/api/v1/posts',commentRouter)
app.use('/api/v1/comments',commentRouter)

//likes routes
app.use('/api/v1/posts',likeRouter)
app.use('/api/v1/comments',likeRouter)

//story routes
app.use('/api/v1/stories',storyRouter)
app.use('/api/v1/users',storyRouter)

//highlight routes
app.use('/api/v1/highlights',highlightRouter)
app.use('/api/v1/users',messageRouter)


app.use('/api/v1/messages',highlightRouter)

app.use(errorHandler);
export { app, io,server };
