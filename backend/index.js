const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const socketIo = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB connection
const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DBNAME || "codingsharingdb";

const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.re3ha3x.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.set("io", io);
// Routes
app.get("", (req, res) => {
  res.send("API is running....");
});
app.use("/api/snippets", require("./routes/snippetRoutes"));
app.use("/api/auth", require("./routes/authRoutes.js"));

let users = {};

// socket.io connection
io.on("connection", (socket) => {
  users[socket.id] = socket;

  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
