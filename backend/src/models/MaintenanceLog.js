import mongoose from 'mongoose';

const maintenanceLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required']
    },
    maintenanceType: {
      type: String,
      required: [true, 'Maintenance type is required'],
      trim: true,
      enum: {
        values: [
          'Routine Service',
          'Oil Change',
          'Brake Overhaul',
          'Engine Diagnostics',
          'Tire Replacement',
          'Transmission Repair',
          'Electrical Inspection',
          'Emergency Repair',
          'Other'
        ],
        message: '{VALUE} is not a recognized maintenance type'
      }
    },
    description: {
      type: String,
      required: [true, 'Work order description is required'],
      trim: true
    },
    cost: {
      type: Number,
      required: [true, 'Maintenance cost is required'],
      min: [0, 'Cost cannot be negative']
    },
    startDate: {
      type: Date,
      required: [true, 'Service start date is required'],
      default: Date.now
    },
    completionDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: {
        values: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        message: '{VALUE} is not a valid maintenance status'
      },
      default: 'In Progress',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for vehicle maintenance history and active in-shop orders
maintenanceLogSchema.index({ vehicle: 1, status: 1 });
maintenanceLogSchema.index({ status: 1, startDate: -1 });

const MaintenanceLog = mongoose.model('MaintenanceLog', maintenanceLogSchema);

export default MaintenanceLog;

