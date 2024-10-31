import Package from "../models/packageModel.js";
import Driver from "../models/driverModel.js";
import Rider from "../models/riderModel.js";
export const createPackageTrip = async (req, res) => {
    // const { origin, destination, weight } = req.body;
    // pickup point, drop point, weight, vehicle type, date, time
    const { id, origin, destination, weight, vehicleType, date, time } =
        req.body;
    if (!origin || !destination || !weight || !vehicleType || !date || !time) {
        res.status(400).json({ message: "Please provide all required fields" });
    }

    let distance = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
        .then((res) => res.json())
        .then((data) => {
            return data.rows[0].elements[0].distance.value;
        });

    distance = distance / 1000; // convert to km
    const fare = calculateFare(weight, distance, vehicleType);

    const newPackage = new Package({
        rider: id,
        origin,
        destination,
        weight,
        vehicleType,
        date,
        time,
        fare,
    });

    try {
        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const calculateFare = (weight, distance, vehicleType) => {
    let fare = 0;
    let baseFare = 100;
    if (vehicleType === "bike") {
        fare = baseFare + distance * 0.5;
    } else if (vehicleType === "auto") {
        fare = baseFare + distance * 0.75;
    } else if (vehicleType === "mini-truck") {
        fare = baseFare + distance * 1;
    } else {
        fare = baseFare + distance * 1.5;
    }
    return fare;
};

export const getPackageTrips = async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPendingPackageTrips = async (req, res) => {
    try {
        const packages = await Package.find({ status: "pending" });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPackageTripById = async (req, res) => {
    const { id } = req.params;
    try {
        const pack = await Package.findById(id);

        if (!pack) {
            return res.status(404).json({ message: "Package trip not found" });
        }

        const driver = await Driver.findById(pack.driver);
        const rider = await Rider.findById(pack.rider);

        let resObj = {
            origin: pack.origin || undefined,
            destination: pack.destination || undefined,
            weight: pack.weight || undefined,
            vehicleType: pack.vehicleType || undefined,
            date: pack.date || undefined,
            time: pack.time || undefined,
            status: pack.status || undefined,
            driverName:
                (driver.firstName || "") + " " + (driver.lastName || ""),
            driverPhone: driver.phone || undefined,
            riderName: (rider.firstName || "") + " " + (rider.lastName || ""),
            riderPhone: rider.phone || undefined,
            fare: pack.fare || undefined,
        };
        res.json(resObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePackageTrip = async (req, res) => {
    const { id } = req.params;
    const pack = req.body;
    try {
        const updatedPack = await Package.findByIdAndUpdate(id, pack, {
            new: true,
        });
        res.json(updatedPack);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const confirmPackageTrip = async (req, res) => {
    const { packageId, driverId } = req.body;
    try {
        let pack = await Package.findById(packageId);
        if (!pack) {
            return res.status(404).json({ message: "Package trip not found" });
        }
        pack.status = "confirmed";
        pack.driver = driverId;
        await pack.save();

        const driver = await Driver.findById(driverId);
        driver.status = "busy";
        await driver.save();

        let resObj = {
            origin: pack.origin,
            destination: pack.destination,
            weight: pack.weight,
            vehicleType: pack.vehicleType,
            date: pack.date,
            time: pack.time,
            status: pack.status,
            driverName: driver.firstName + " " + driver.lastName,
            fare: pack.fare,
        };

        return res.json(resObj);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deletePackageTrip = async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);
        res.json({ message: "Package trip deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPackageTripByDriverId = async (req, res) => {
    try {
        const pack = await Package.find({ driver: req.params.id });
        res.json(pack);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPackageTripByRiderId = async (req, res) => {
    try {
        const pack = await Package.find({ rider: req.params.id });
        // sort by date and time
        pack.sort((a, b) => {
            return (
                new Date(a.date + " " + a.time) -
                new Date(b.date + " " + b.time)
            );
        });
        res.json(pack);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const estimatePackage = async (req, res) => {
    const { origin, destination, weight, vehicleType, date, time } = req.body;
    if (!origin || !destination || !weight || !vehicleType || !date || !time) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }

    let distance = 0;
    try {
        distance = await fetch(
            `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        )
            .then((res) => res.json())
            .then((data) => {
                return data.rows[0].elements[0].distance.value;
            });
    } catch (error) {
        return res
            .status(400)
            .json({ message: `${origin} to ${destination} are not available` });
    }

    try {
        distance = distance / 1000; // convert to km
        const fare = calculateFare(weight, distance, vehicleType);

        let resObj = {
            origin,
            destination,
            weight,
            vehicleType,
            date,
            time,
            fare,
            distance,
        };
        res.json(resObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
