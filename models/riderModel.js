import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const riderSchema = new mongoose.Schema(
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
