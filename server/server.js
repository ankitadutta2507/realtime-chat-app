const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const cors = require("cors");


// Create Express app
const app = express();


// Enable CORS
app.use(cors());


// Create HTTP server
const server = http.createServer(app);


// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});


// When a user connects
io.on("connection", (socket) => {

    console.log("A user connected");


    // Listen for messages from frontend
    socket.on("send_message", (data) => {

        console.log(data);

        // Send message to all connected users
        io.emit("receive_message", data);

    });


    // When user disconnects
    socket.on("disconnect", () => {

        console.log("User disconnected");

    });

});


// Start server
server.listen(3001, () => {

    console.log("Server is running on port 3001");

});