const mongoose = require('mongoose');

const BirthdaySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  birthday: {
    day: { type: Number, required: true },
    month: { type: Number, required: true },
  },
});

module.exports = mongoose.model('Birthday', BirthdaySchema);