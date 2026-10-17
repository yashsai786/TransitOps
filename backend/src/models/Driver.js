import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true
    },
    licenseNumber: {
      type: String,
      required: [true, 'Driver license number is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    licenseCategory: {
      type: String,
      required: [true, 'License category is required'],
      trim: true,
      enum: {
        values: ['Commercial Heavy', 'Commercial Medium', 'Light Vehicle', 'Hazmat', 'Articulated'],
        message: '{VALUE} is not a valid license category'
      }
    },
    licenseExpiryDate: {
      type: Date,
      required: [true, 'License expiry date is required']
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true
    },
    safetyScore: {
      type: Number,
      default: 100,
      min: [0, 'Safety score cannot be less than 0'],
      max: [100, 'Safety score cannot exceed 100']
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
        message: '{VALUE} is not a valid driver status'
      },
      default: 'Available',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for dispatch status lookups and license expiry tracking
driverSchema.index({ status: 1 });
driverSchema.index({ licenseExpiryDate: 1 });

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;

