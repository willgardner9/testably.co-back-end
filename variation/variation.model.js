const mongoose = require('mongoose');

const { Schema } = mongoose;

const VariationSchema = new Schema(
  {
    abtest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Abtest',
      required: true,
    },
    variable: {
      type: String,
      required: true,
    },
    sessions: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
    },
  },
);

module.exports = mongoose.model('Variation', VariationSchema);
