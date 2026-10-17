import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      trim: true,
      enum: {
        values: ['Toll', 'Fuel', 'Maintenance', 'Insurance', 'Permit', 'Parking', 'Fine', 'Other'],
        message: '{VALUE} is not a valid expense category'
      }
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [0, 'Expense amount cannot be negative']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required'],
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for financial aggregation and vehicle operational cost calculations
expenseSchema.index({ vehicle: 1, date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ trip: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;

