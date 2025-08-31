const http = require("http");
const socketIo = require("socket.io");
const app = require("./app");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("register", ({ id }) => {
    console.log(id)
    userSocketMap[id] = socket.id;
    console.log(`User ${id} registered with socket ID ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of Object.entries(userSocketMap)) {
      if (id === socket.id) {
        delete userSocketMap[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});


app.set("io", io);
app.set("userSocketMap", userSocketMap);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
