const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add a positive amount'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      required: [true, 'Please specify type: income or expense'],
      enum: ['income', 'expense'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Food',
        'Shopping',
        'Rent',
        'Salary',
        'Stipend',
        'Investment',
        'Groceries',
        'Education',
        'Entertainment',
        'Medical',
        'Transport',
        'Others',
      ],
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
