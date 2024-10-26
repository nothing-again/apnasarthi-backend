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

/*
new ren
*/

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
