import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authProfessionalRoute from "./routes/authProfessional.js";
import authClientRoute from "./routes/authClient.js";
import professional from "./routes/professional.js";
import client from "./routes/client.js";
import requests from "./routes/requests.js"
import chat from './routes/chat.js'
import message from './routes/message.js'
import stripe from './routes/stripe.js'
import cookieParser from "cookie-parser";
import cors from "cors"
import { createServer } from "http"; // Import createServer from http module
import { Server } from "socket.io";


const app = express();
const server = createServer(app); // Create HTTP server

dotenv.config();

const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGO);
		console.log("Connected to mongoDB");
	} catch (error) {
		throw error;
	}
};

mongoose.connection.on("disconnected", ()=> {
	console.log("mongoDB disconnected");
})

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.get("/", (req,res) => {
    res.send("Hello to my api")
})

app.use("/api/authProfessional", authProfessionalRoute);
app.use("/api/authClient", authClientRoute);
app.use("/api/professional", professional);
app.use("/api/client", client);
app.use("/api/requests", requests);
app.use("/api/chat", chat);
app.use("/api/message", message);
app.use("/api/stripe", stripe);

app.use((err,req,res,next)=>{
	const errorStatus = err.status || 500
	const errorMessage =  err.message || "Something went wrong"
	return res.status(errorStatus).json({
		success: false,
		status: errorStatus,
		message: errorMessage,
		stack: err.stack
	})
})

// const io = new Server(server,{
// 	cors :{
// 	  origin : '*',
// 	  credentials : true
// 	}
//   })

//   global.onlineUsers = new Map();

//   io.on("connection", (socket)=>{
// 	console.log('connect to socket', socket.id);
// 	global.chatSocket = socket;

// 	socket.on("add-user", (userId)=>{
// 	  onlineUsers.set(userId, socket.id);
// 	})

// 	socket.on("send-msg", (data)=>{
// 	  const sendUnderSocket = onlineUsers.get(data.to);
// 	  if(sendUnderSocket){
// 		socket.to(sendUnderSocket).emit("msg-recieve", data.message)
// 	  }
// 	})

// 	socket.on("send-notification", (data)=>{
// 	  const sendUnderSocket = onlineUsers.get(data.to);
// 	  if(sendUnderSocket){
// 		socket.to(sendUnderSocket).emit("notification-recieve",data.message)
// 	  }
// 	})

//   })

app.listen(8800, ()=>{
	connect()
	console.log("Connected to backend")
})
