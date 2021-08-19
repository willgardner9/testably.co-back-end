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

//  when deleting an ab test, we want to also delete all associated variation to economise database space
//  this function creates an array of all variations that are associated with that abtest
//  and then iterates through this array deleting each variation
const deleteVariations = async (abtest) => {
  const variations = await Variation.find({ abtest });
  for (let i = 0; i < variations.length; i++) {
    const { id } = variations[i];
    deleteVariation(id);
  }
  return variations;
};

const patchVariation = async (id, sessions, conversions) => {
  //  if this request is not to add a conversion, it must be to add a session
  //  therefore patch variation by incrementing sessions by one
  if (!conversions) {
    const patchedVariation = await Variation.findByIdAndUpdate(id, {
      $inc: { sessions: 1 },
    },
    {
      returnOriginal: false,
    });
    return patchedVariation;
  }
  //  if this request is to add a conversion, we have already added a session increment
  //  so increment conversions instead
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
