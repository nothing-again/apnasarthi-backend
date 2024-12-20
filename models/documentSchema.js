import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
