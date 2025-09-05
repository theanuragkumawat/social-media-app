import mongoose from "mongoose";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

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
import userRouter from "./routes/user.route.js"
import healthCheckRouter from "./routes/healthcheck.route.js"

//routes
app.use('/api/v1/users',userRouter); //for give direction
app.use('/api/v1/healthcheck',healthCheckRouter);


export { app };
