import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Replace with your frontend's URL if it's specific
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("a user connected");

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
};
