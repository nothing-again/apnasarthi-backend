import Driver from "../models/driverModel.js";

export const getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getDriver = async (req, res) => {
    const { id } = req.params;
    try {
        const driver = await Driver.findById(id);
        res.status(200).json(driver);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createDriver = async (req, res) => {
    const driver = req.body;
    const newDriver = new Driver(driver);
    try {
        await newDriver.save();
        res.status(201).json(newDriver);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updateDriver = async (req, res) => {
    const { id } = req.params;
    const driver = req.body;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No driver with id: ${id}`);
    const updatedDriver = await Driver.findByIdAndUpdate(
        id,
        { ...driver, id },
        { new: true }
    );
    res.json(updatedDriver);
};

export const deleteDriver = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No driver with id: ${id}`);
    await Driver.findByIdAndRemove(id);
    res.json({ message: "Driver deleted successfully." });
};
