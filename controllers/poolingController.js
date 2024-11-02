import Intercity from "../models/intercityModel.js";

export const getEstimatedFare = async (req, res) => {
    const { origin, destination, noOfPeople } = req.body;

    try {
        const intercity = await Intercity.findOne({
            origin,
            destination,
        });

        if (!intercity) {
            return res.status(404).json({ message: "No ride available" });
        }

        const fare = intercity.fare * noOfPeople;

        res.json({ fare });
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
