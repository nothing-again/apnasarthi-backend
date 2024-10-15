import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  color: String,
  insuranceNumber: {
    type: String,
    required: true,
  },
  insuranceExpiry: {
    type: Date,
    required: true,
  },
  registration: {
    type: String,
    required: true,
  },
  documents: {
    registrationCertificate: {
      type: String,
      required: true,
    },
    insurance: {
      type: String,
      required: true,
    },
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
