import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const driverSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        phone: {
            type: String,
        },
        otp: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            default: false,
        },
        isOnRide: {
            type: Boolean,
            default: false,
        },
        location: {
            type: { type: String },
            coordinates: [],
        },
        address: {
            type: String,
        },
        drivingLicense: {
            type: String,
        },
        drivingLicenseExpiry: {
            type: Date,
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
        },
        documents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Document",
            },
        ],
    },
    {
        timestamps: true,
    }
);

driverSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

driverSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
