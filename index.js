import http from "http";
import app from "./app.js";
import { connectToDatabase } from "./config/dbConfig.js";
import { port } from "./config/dotenv.config.js";
import { Server } from "socket.io"; // Import Socket.IO

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("rideRequest", (data) => {
        console.log("Ride request received:", data);

        io.emit("rideRequested", data);
    });

    socket.on("rideAccepted", (data) => {
        console.log("Ride accepted:", data);
        io.emit("rideAccepted", data);
    });

    socket.on("locationUpdate", (locationData) => {
        console.log("Location updated:", locationData);
        io.emit("locationUpdate", locationData);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Basic route
app.get("/", (_, res) => {
    res.send("Hello World!");
});

// Start the server
server.listen(port, () => {
    connectToDatabase();
    console.log(`Server running at http://localhost:${port}`);
});
