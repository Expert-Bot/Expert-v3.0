const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  guildId: String,
  counter: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

