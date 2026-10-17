import mongoose from 'mongoose';

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required']
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null
    },
    liters: {
      type: Number,
      required: [true, 'Fuel quantity in liters is required'],
      min: [0.01, 'Fuel quantity must be greater than zero']
    },
    cost: {
      type: Number,
      required: [true, 'Fuel cost is required'],
      min: [0, 'Cost cannot be negative']
    },
    date: {
      type: Date,
      required: [true, 'Refueling date is required'],
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for vehicle fuel history and reporting aggregations
fuelLogSchema.index({ vehicle: 1, date: -1 });
fuelLogSchema.index({ trip: 1 });

const FuelLog = mongoose.model('FuelLog', fuelLogSchema);

export default FuelLog;

