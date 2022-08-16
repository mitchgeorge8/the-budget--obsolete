const { Schema, model } = require("mongoose");

const budgetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  frequency: {
    type: Number,
    required: true,
  },
  timeframe: {
    type: String,
    required: true,
  },
});

const Budget = model("Budget", budgetSchema);

module.exports = Budget;
