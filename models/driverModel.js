import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const driverSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            index: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email!`,
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            validate: {
                validator: function (v) {
                    return /^\+?[1-9]\d{1,14}$/.test(v);
                },
                message: (props) =>
                    `${props.value} is not a valid phone number!`,
            },
        },
        rating: {
            type: Number,
            default: 5.0,
            min: [1, "Rating cannot be lower than 1"],
            max: [5, "Rating cannot be higher than 5"],
        },
        status: {
            type: String,
            enum: ["available", "on-trip", "offline"],
            default: "offline",
        },
        vehicle: {
            type: String,
            required: true,
        },
        licenseNumber: {
            type: String,
            required: true,
            unique: true,
        },
        licenseExpiry: {
            type: Date,
            required: true,
        },
        documents: {
            drivingLicense: {
                frontImage: { type: String, required: true },
                backImage: { type: String, required: true },
            },
            insurance: {
                type: String,
                required: true,
            },
        },
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
