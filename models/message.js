const mongoose = require('mongoose');
const { Schema } = require('mongoose');
// Require package date-fns to format date
const { format } = require('date-fns');

const messageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  title: { type: String, default: '' }, // Optional title
  timeStamp: { type: Date, default: Date.now }, // Creation timestamp
  text: { type: String, required: true, minLength: 1 }, // Required message text
});

messageSchema.virtual('formattedTimeStamp').get(function () {
  return format(this.timeStamp, 'd LLL Y H:mm');
});

// Export schema
module.exports = mongoose.model('Message', messageSchema);
