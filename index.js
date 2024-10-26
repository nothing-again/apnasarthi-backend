import http from "http";
import app from "./app.js";
import { connectToDatabase } from "./config/dbConfig.js";
import { port } from "./config/dotenv.config.js";
import { Server } from "socket.io";

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Store active drivers and rides in memory
const activeDrivers = new Map(); // socketId -> driverInfo
const activeRides = new Map(); // rideId -> rideInfo

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Driver joins the drivers room when they come online
    socket.on("driverOnline", (driverInfo) => {
        socket.join("drivers");
        activeDrivers.set(socket.id, {
            ...driverInfo,
            socketId: socket.id,
            status: "available",
        });
        console.log("Driver went online:", driverInfo);
    });

    // Rider requests a ride
    socket.on("rideRequest", (data) => {
        const rideId = generateRideId();
        const rideRequest = {
            rideId,
            riderId: socket.id,
            origin: data.origin,
            destination: data.destination,
            fare: data.fare,
            status: "pending",
            timestamp: new Date(),
        };

        activeRides.set(rideId, rideRequest);

        // Emit to all available drivers
        io.to("drivers").emit("rideRequested", rideRequest);

        // Emit back to rider to confirm request received
        socket.emit("rideRequestConfirmed", rideRequest);

        console.log("Ride request received:", rideRequest);
    });

    // Driver accepts a ride
    socket.on("rideAccepted", (data) => {
        const ride = activeRides.get(data.rideId);
        if (ride && ride.status === "pending") {
            // Update ride status
            ride.status = "accepted";
            ride.driverId = socket.id;
            ride.driverInfo = activeDrivers.get(socket.id);

            // Update driver status
            const driver = activeDrivers.get(socket.id);
            if (driver) {
                driver.status = "busy";
                driver.currentRideId = data.rideId;
            }

            // Notify the rider
            io.to(ride.riderId).emit("rideAccepted", {
                rideId: data.rideId,
                driverInfo: driver,
            });

            // Notify other drivers that ride is no longer available
            socket.to("drivers").emit("rideUnavailable", data.rideId);

            console.log("Ride accepted:", ride);
        }
    });

    // Driver cancels an accepted ride
    socket.on("rideDriverCancelled", (data) => {
        const ride = activeRides.get(data.rideId);
        if (ride && ride.driverId === socket.id) {
            ride.status = "cancelled";

            // Free up the driver
            const driver = activeDrivers.get(socket.id);
            if (driver) {
                driver.status = "available";
                driver.currentRideId = null;
            }

            // Notify the rider
            io.to(ride.riderId).emit("rideDriverCancelled", {
                rideId: data.rideId,
                reason: data.reason,
            });

            // Make ride available to other drivers again
            io.to("drivers").emit("rideRequested", ride);
        }
    });

    // Rider cancels their ride request
    socket.on("rideRiderCancelled", (data) => {
        const ride = activeRides.get(data.rideId);
        if (ride && ride.riderId === socket.id) {
            ride.status = "cancelled";

            if (ride.driverId) {
                // Free up the assigned driver if any
                const driver = activeDrivers.get(ride.driverId);
                if (driver) {
                    driver.status = "available";
                    driver.currentRideId = null;
                }

                // Notify the driver
                io.to(ride.driverId).emit("rideRiderCancelled", {
                    rideId: data.rideId,
                    reason: data.reason,
                });
            } else {
                // Notify all drivers if ride wasn't accepted yet
                io.to("drivers").emit("rideUnavailable", data.rideId);
            }
        }
    });

    // Driver updates their location
    socket.on("locationUpdate", (locationData) => {
        const driver = activeDrivers.get(socket.id);
        if (driver && driver.currentRideId) {
            const ride = activeRides.get(driver.currentRideId);
            if (ride) {
                // Send location update to the specific rider
                io.to(ride.riderId).emit("driverLocation", {
                    rideId: driver.currentRideId,
                    location: locationData,
                });
            }
        }
        console.log("Location updated:", locationData);
    });

    // Driver completes a ride
    socket.on("rideCompleted", (data) => {
        const ride = activeRides.get(data.rideId);
        if (ride && ride.driverId === socket.id) {
            ride.status = "completed";
            ride.completedAt = new Date();

            // Free up the driver
            const driver = activeDrivers.get(socket.id);
            if (driver) {
                driver.status = "available";
                driver.currentRideId = null;
            }

            // Notify the rider
            io.to(ride.riderId).emit("rideCompleted", {
                rideId: data.rideId,
                fare: ride.fare,
                duration: ride.completedAt - ride.timestamp,
            });
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        // Clean up driver data if a driver disconnects
        if (activeDrivers.has(socket.id)) {
            const driver = activeDrivers.get(socket.id);
            if (driver.currentRideId) {
                const ride = activeRides.get(driver.currentRideId);
                if (ride) {
                    // Notify rider that driver disconnected
                    io.to(ride.riderId).emit("driverDisconnected", {
                        rideId: driver.currentRideId,
                    });
                }
            }
            activeDrivers.delete(socket.id);
        }

        console.log("A user disconnected:", socket.id);
    });
});

// Helper function to generate ride IDs
function generateRideId() {
    return "RIDE_" + Math.random().toString(36).substr(2, 9);
}

// Basic route
app.get("/", (_, res) => {
    res.send("Hello World!");
});

// Start the server
server.listen(port, () => {
    connectToDatabase();
    console.log(`Server running at http://localhost:${port}`);
});
