const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const record = new Schema({
  label: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  userId: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("record", record);
