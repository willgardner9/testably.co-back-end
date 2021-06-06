/* eslint-disable no-plusplus */
/* eslint-disable max-len */
const Variation = require('./variation.model');

//  ** HELPER FUNCTIONS **  //

const deleteVariation = async (id) => {
  const deletedVariation = await Variation.findByIdAndDelete({ _id: id });
  return deletedVariation;
};

// ** SERVICE FUNCTIONS  **  //

const createNewVariation = async (abtest, variable) => {
  const variation = await Variation.create({ abtest, variable });
  return variation;
};

const deleteVariations = async (abtest) => {
  const variations = await Variation.find({ abtest });
  for (let i = 0; i < variations.length; i++) {
    const { id } = variations[i];
    deleteVariation(id);
  }
  return variations;
};

const patchVariation = async (id, sessions, conversions) => {
  //  patch variation for update sessions
  if (!conversions) {
    const patchedVariation = await Variation.findByIdAndUpdate(id, {
      $inc: { sessions: 1 },
    },
    {
      returnOriginal: false,
    });
    return patchedVariation;
  }
  //  patch variation for update conversions
  const patchedVariation = await Variation.findByIdAndUpdate(id, {
    $inc: { conversions: 1 },
  },
  {
    returnOriginal: false,
  });
  return patchedVariation;
};

const getSingleVariation = async (id) => {
  const variation = await Variation.findById(id);
  return variation;
};

module.exports = {
  createNewVariation,
  deleteVariations,
  patchVariation,
  getSingleVariation,
  deleteVariation,
};
