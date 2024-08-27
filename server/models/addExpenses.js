const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    },
    date: {
      type: Date,
      required: [true, "Date is required"]
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    payee: {
      type: String,
      required: [true, "Payee is required"]
    },
    description: {
      type: String,
      required: [true, "Description is required"]
    },
    category: {
      type: String,
      required: [true, "Category is required"]
    },
    receipt: {
      type: String,
      // Optional field for storing the URL or path of the receipt
    },
    added_by: {
      type: String,
      required: [true, "Username is required"]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
