import Intercity from "../models/intercityModel.js";
import Vehicle from "../models/vehicleSchema.js";
import Driver from "../models/driverModel.js";
import { getDistanceFromCoords } from "../utils/getDistance.js";

export const getEstimatedFare = async (req, res) => {
  const { origin, destination, noOfPeople } = req.body;

  try {
    // Fetch ongoing intercity rides and populate driver and vehicle info in a single query
    const intercityRides = await Intercity.find({ status: "ongoing" })
      .populate({
        path: "driver",
        select: "firstName lastName vehicle",
        populate: {
          path: "vehicle",
          select: "vehicleType",
        },
      })
      .lean();

    // Process rides to calculate fares if within distance threshold
    const result = await Promise.all(
      intercityRides.map(async (ride) => {
        const distance = await getDistanceFromCoords(origin, ride.destination);

        // Only include rides within 10 km distance
        if (distance < 10) {
          const fare = distance * 10 * noOfPeople;
          return {
            fare,
            distance,
            origin: ride.origin,
            destination: ride.destination,
            date: ride.date,
            _id: ride._id,
            driver: ride.driver
              ? `${ride.driver.firstName} ${ride.driver.lastName}`
              : "Unknown Driver",
            vehicle: ride.driver?.vehicle?.vehicleType || "Unknown Vehicle",
          };
        }
        return null;
      })
    );

    // Filter out null values from results
    const filteredResult = result.filter(Boolean);

    res.status(200).json(filteredResult);
  } catch (err) {
    console.error(err);
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
