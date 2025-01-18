const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const connectDB = require("./config/db");

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
connectDB();

app.set("io", io);
// Routes
app.get("", (req, res) => {
  res.send("API is running....");
});
app.use("/api/snippets", require("./routes/snippetRoutes"));

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
