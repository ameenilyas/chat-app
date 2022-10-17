import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dbConnect from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import path from "path";

// instantiation
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "https://chat-007-app.herokuapp.com/"],
    methods: ["GET", "POST"],
  },
});

// server configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
// middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://chat-007-app.herokuapp.com/"],
  })
);
dotenv.config();

// DB Config
dbConnect();

// routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// -----------DEPLOYEMENT ----------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("api running successfully");
  });
}

// handling wrong route
app.use((req, res) => {
  res.send({
    code: "rest_no_route",
    message: "No route was found matching the URL and request method.",
    data: {
      status: 404,
    },
  });
});

// listening
server.listen(PORT, () => console.log(`It's listening to port ${PORT}`));

// Web Sockets Config
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("user joined : " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    if (!chat.users) {
      console.log("chat.users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
      }
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("USER DICONNECTED");
    socket.leave(userData.id);
  });
});
