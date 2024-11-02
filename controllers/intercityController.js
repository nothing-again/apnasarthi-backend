import Driver from "../models/driverModel.js";
import Intercity from "../models/intercityModel.js";
import Vehicle from "../models/vehicleSchema.js";

// getIntercityByRiderId,
// getIntercityById,
// createIntercity,
// updateIntercity,
// deleteIntercity,
// getIntercityByDriverId,
// getIntercityByStatus,
// getEstimatedFare,

export const getIntercityByRiderId = async (req, res) => {
    try {
        const intercity = await Intercity.find({
            rider: req.params.riderId,
        }).sort({
            date: -1,
            arrivalTime: -1,
        });
        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getIntercityById = async (req, res) => {
    try {
        const intercity = await Intercity.findById(req.params.id);
        let driver = await Driver.findById(intercity.driver);
        let rider = await Rider.findById(intercity.rider);

        let resObj = {
            id: intercity._id,
            origin: intercity.origin,
            destination: intercity.destination,
            time: intercity.arrivalTime,
            fare: intercity.fare,
            date: intercity.date,
            driverName: driver.firstName + " " + driver.lastName,
            driverPhone: driver.phone,
            riderName: rider.firstName + " " + rider.lastName,
            riderPhone: rider.phone,
        };
        res.json(resObj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createIntercity = async (req, res) => {
    const {
        origin,
        destination,
        noOfPeople,
        date,
        time,
        rider,
        fare,
        rideShare,
    } = req.body;
    if (
        !origin ||
        !destination ||
        !noOfPeople ||
        !date ||
        !time ||
        !rider ||
        !fare
    ) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    try {
        const distance = 10;
        const intercity = new Intercity({
            origin,
            destination,
            noOfPeople,
            date,
            arrivalTime: time,
            rider,
            fare,
            distance,
            status: "Available",
            rideShare,
        });
        await intercity.save();
        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateIntercity = async (req, res) => {
    try {
        const intercity = await Intercity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteIntercity = async (req, res) => {
    try {
        const intercity = await Intercity.findByIdAndDelete(req.params.id);
        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getIntercityByDriverId = async (req, res) => {
    try {
        const intercity = await Intercity.find({ driver: req.params.driverId });
        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getIntercityByStatus = async (req, res) => {
    try {
        const intercity = await Intercity.find({ status: req.params.status });
        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getEstimatedFare = async (req, res) => {
    const { origin, destination, noOfPeople } = req.body;
    try {
        let distance = await fetch(
            `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        )
            .then((res) => res.json())
            .then((data) => data.rows[0].elements[0].distance.value);
        distance = distance / 1000;
        //     const availableDrivers = await Driver.find({ available: true });
        //     const availableVehicles = await Vehicle.find({ driver: availableDrivers[0]._id });

        //     let resObj = [];
        //    for(let i = 0; i < availableDrivers.length; i++){
        //        const perKm = availableDrivers[i].farePerKm;
        //        const vehicle  = Vehicle.find({driver: availableDrivers[i]._id});
        //        if(distance < 75 ){
        //        }

        //    }
        let fareObj = [
            {
                vehicleType: "Mini(Swift, WagonR)",
                fare: distance * 19.5,
            },
            {
                vehicleType: "SUV(Scorpio, Belero)",
                fare: distance * 30,
            },
        ];
        res.json(fareObj);
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

export const getHistoryByDriverId = async (req, res) => {
    try {
        const intercity = await Intercity.find({
            driver: req.params.driverId,
        });
        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getHistoryByRiderId = async (req, res) => {
    try {
        const intercity = await Intercity.find({
            rider: req.params.riderId,
        });
        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const confirmIntercity = async (req, res) => {
    const { driverId, intercityId } = req.body;
    if (!driverId || !intercityId) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    try {
        const driver = await Driver.findById(driverId);
        const intercity = await Intercity.findById(intercityId);
        if (!driver || !intercity) {
            return res
                .status(400)
                .json({ message: "Driver or Intercity not found" });
        }
        intercity.driver = driverId;
        intercity.status = "Confirmed";
        await intercity.save();
        res.json(intercity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
