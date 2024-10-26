import Rental from "../models/rentalModel.js";

export const getRentals = async (req, res) => {
    try {
        const rentals = await Rental.find();
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRentalById = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (rental) {
            res.json(rental);
        } else {
            res.status(404).json({ message: "Rental not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRental = async (req, res) => {
    const { pickupPoint, startDate, endDate, vehicleType } = req.body;

    if (!pickupPoint || !startDate || !endDate || !vehicleType) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }

    const newRental = new Rental({
        pickupPoint,
        startDate,
        endDate,
        vehicleType,
    });

    try {
        await newRental.save();
        res.status(201).json(newRental);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteRental = async (req, res) => {
    const { id } = req.params;
    try {
        await Rental.findByIdAndDelete(id);
        res.json({ message: "Rental deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPendingRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({ status: "pending" });
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRentalByRider = async (req, res) => {
    try {
        const rentals = await Rental.find({ rider: req.params.id });
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRentalByDriver = async (req, res) => {
    try {
        const rentals = await Rental.find({ driver: req.params.id });
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRentalPrice = async (req, res) => {
    const { driverId, rentalId } = req.body;

    try {
        const rental = await Rental.findById(rentalId);
        const driver = await Driver.findById(driverId);
        if (!rental || !driver) {
            return res
                .status(404)
                .json({ message: "Rental or driver not found" });
        }
        const farePerDay = Number(driver.farePerDay);
        let totalFare = 0;
        const startDate = new Date(rental.startDate);
        const endDate = new Date(rental.endDate);
        const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (isNaN(farePerDay) || isNaN(diffDays)) {
            return res
                .status(400)
                .json({ message: "Invalid fare per day or number of days" });
        }
        totalFare = diffDays * farePerDay;
        res.json(totalFare);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRental = async (req, res) => {
    const { id } = req.params;
    const rental = req.body;
    try {
        const updatedRental = await Rental.findByIdAndUpdate(id, rental, {
            new: true,
        });
        res.json(updatedRental);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
