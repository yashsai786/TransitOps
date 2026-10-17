import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Vehicle registration number is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Vehicle model or name is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      trim: true,
      enum: {
        values: ['Truck', 'Van', 'Bus', 'Trailer', 'Semi-Trailer', 'Tanker', 'Pickup'],
        message: '{VALUE} is not a supported vehicle type'
      }
    },
    maxLoadCapacity: {
      type: Number,
      required: [true, 'Maximum load capacity is required (in kg)'],
      min: [0, 'Maximum load capacity cannot be negative']
    },
    odometer: {
      type: Number,
      required: [true, 'Odometer reading is required'],
      default: 0,
      min: [0, 'Odometer reading cannot be negative']
    },
    acquisitionCost: {
      type: Number,
      required: [true, 'Acquisition cost is required'],
      min: [0, 'Acquisition cost cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'On Trip', 'In Shop', 'Retired'],
        message: '{VALUE} is not a valid vehicle status'
      },
      default: 'Available',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for status queries and registration number search
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ type: 1, status: 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;

