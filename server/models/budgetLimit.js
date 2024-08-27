const mongoose = require('mongoose');
const User = require('../models/userModel'); // Import the User model

const budgetLimitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  limit: { type: Number, required: true },
  notifications: [
    {
      date: { type: Date, default: Date.now },
      message: { type: String, required: true },
    }
  ],
});

module.exports = mongoose.model('BudgetLimit', budgetLimitSchema);
