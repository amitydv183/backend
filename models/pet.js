const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  petName: { type: String, required: true },
  type: { type: String, required: true },
  age: { type: Number, required: true },
  vaccinations: [{ type: String }],
  image: {
    public_id: { type: String, required: true },
    url: { type: String, required: true }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Pet', petSchema);
