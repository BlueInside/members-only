const mongoose = require('mongoose');

const { Schema } = require('mongoose');

const messageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  title: { type: String, default: '' }, // Optional title
  timeStamp: { type: Date, default: Date.now }, // Creation timestamp
  text: { type: String, required: true, minLength: 1 }, // Required message text
});

// Export schema
exports.default = mongoose.model('Message', messageSchema);
