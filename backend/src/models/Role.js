import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      lowercase: true,
      trim: true,
      enum: {
        values: ['fleet_manager', 'dispatcher', 'safety_officer', 'financial_analyst'],
        message: '{VALUE} is not a valid role identifier'
      }
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    permissions: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Role = mongoose.model('Role', roleSchema);

export default Role;

