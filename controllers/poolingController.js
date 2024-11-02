import Intercity from "../models/intercityModel.js";
import Vehicle from "../models/vehicleSchema.js";
import Driver from "../models/driverModel.js";
import { getDistanceFromCoords } from "../utils/getDistance.js";

export const getEstimatedFare = async (req, res) => {
    const { origin, destination, noOfPeople } = req.body;

    try {
        // Fetch intercity rides with lean for plain objects
        const intercity = await Intercity.find({ status: "ongoing" }).lean();

        // Map over each ride to calculate fare if within distance threshold
        const result = await Promise.all(
            intercity.map(async (i) => {
                const distance = await getDistanceFromCoords(
                    origin,
                    i.destination
                );

                // Check distance threshold and calculate fare
                if (distance < 10) {
                    const fare = distance * 10 * noOfPeople;
                    const driver = await Driver.findById(i.driver);
                    const vehicle = await Vehicle.findById(driver.vehicle);
                    return {
                        fare,
                        distance,
                        origin: i.origin,
                        destination: i.destination,
                        date: i.date,
                        _id: i._id,
                        vehicle: vehicle.vehicleType,
                    };
                }
                return null;
            })
        );

        // Filter out null values from results
        const filteredResult = result.filter(Boolean);

        res.status(200).json(filteredResult);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const availableIntercities = async (req, res) => {
    try {
        const intercity = await Intercity.find({ status: "Available" });
        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const confirmIntercity = async (req, res) => {
    const { riderId, intercityId } = req.body;

    try {
        const intercity = await Intercity.findByIdAndUpdate(
            intercityId,
            { status: "Confirmed", rider: riderId },
            { new: true }
        );

        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
