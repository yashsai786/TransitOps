import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, 'Origin source location is required'],
      trim: true
    },
    destination: {
      type: String,
      required: [true, 'Destination location is required'],
      trim: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Assigned vehicle reference is required']
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Assigned driver reference is required']
    },
    cargoWeight: {
      type: Number,
      required: [true, 'Cargo weight is required (in kg)'],
      min: [0, 'Cargo weight cannot be negative']
    },
    plannedDistance: {
      type: Number,
      default: 0,
      min: [0, 'Planned distance cannot be negative']
    },
    finalOdometer: {
      type: Number,
      min: [0, 'Final odometer reading cannot be negative'],
      default: null
    },
    fuelConsumed: {
      type: Number,
      default: 0,
      min: [0, 'Fuel consumed cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
        message: '{VALUE} is not a valid trip status'
      },
      default: 'Draft',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for dispatch lookups and active trips
tripSchema.index({ status: 1 });
tripSchema.index({ vehicle: 1, status: 1 });
tripSchema.index({ driver: 1, status: 1 });

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;

