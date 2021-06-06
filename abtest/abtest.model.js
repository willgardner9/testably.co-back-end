/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const AbtestSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['copy', 'colour', 'src'],
      required: true,
    },
    conversionURL: {
      type: String,
      required: true,
    },
    variations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Variation',
    }],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Abtest', AbtestSchema);
