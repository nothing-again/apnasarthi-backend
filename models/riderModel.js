import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const riderSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        phone: {
            type: String,
        },
        otp: {
            type: Number,
        },
        location: {
            type: {
                latitude: Number,
                longitude: Number,
            },
            default: null,
        },
        paymentMethod: {
            type: String,
            enum: ["card", "paypal", "googlepay", "applepay"],
            default: "card",
        },
        rating: {
            type: Number,
            default: 5.0,
            min: [1, "Rating cannot be lower than 1"],
            max: [5, "Rating cannot be higher than 5"],
        },
    },
    {
        timestamps: true,
    }
);

riderSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

riderSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Rider = mongoose.model("Rider", riderSchema);

export default Rider;
