const Abtest = require('./abtest.model');

const createNewAbtest = async (user, type, conversionURL) => {
  const abtest = await Abtest.create({ user, type, conversionURL });
  return abtest;
};

const updateAbtest = async (id, conversionURL) => {
  const updatedAbtest = await Abtest.findByIdAndUpdate(id, {
    conversionURL,
  },
  {
    returnOriginal: false,
  });
  return updatedAbtest;
};

const getAbtest = async (id) => {
  const abtest = await Abtest.findById(id).populate('variations');
  return abtest;
};

const deleteAbtest = async (id) => {
  const abtest = await Abtest.findByIdAndDelete(id);
  return abtest;
};

const updateWithNewVariation = async (abtest, variationID) => {
  const updatedAbtest = await Abtest.findByIdAndUpdate(abtest, {
    $push: { variations: variationID },
  },
  {
    returnOriginal: false,
  });
  return updatedAbtest;
};

const getAllAbtests = async (id) => {
  const abtestsObj = await Abtest.find({ user: id }).populate('variations');
  return abtestsObj;
};

const deleteSingleVariation = async (abtest, id) => {
  const updatedAbtest = await Abtest.findByIdAndUpdate(
    {
      _id: abtest,
    },
    {
      $pull: { variations: id },
    },
    {
      returnOriginal: false,
    },
  );
  return updatedAbtest;
};

module.exports = {
  createNewAbtest,
  updateAbtest,
  getAbtest,
  updateWithNewVariation,
  getAllAbtests,
  deleteAbtest,
  deleteSingleVariation,
};
