import Vehicle from "../models/vehicleSchema.js";

export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (vehicle) {
            res.json(vehicle);
        } else {
            res.status(404).json({ message: "Vehicle not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createVehicle = async (req, res) => {
    const [driverId, make, type, model] = req.body;
};

export const updateVehicle = async (req, res) => {
    const { id } = req.params;
    const vehicle = req.body;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No vehicle with id: ${id}`);
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
        id,
        { ...vehicle, id },
        { new: true }
    );
    res.json(updatedVehicle);
};

export const deleteVehicle = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No vehicle with id: ${id}`);
    await Vehicle.findByIdAndRemove(id);
    res.json({ message: "Vehicle deleted successfully." });
};
