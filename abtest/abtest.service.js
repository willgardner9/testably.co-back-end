const Abtest = require('./abtest.model');

const createNewAbtest = async (user, type, name, conversionURL) => {
  //  create new abtest
  const abtest = await Abtest.create({
    user, type, name, conversionURL,
  });
  //  return new abtest
  return abtest;
};

const updateAbtest = async (id, conversionURL) => {
  //  update abtest and return updated original
  const updatedAbtest = await Abtest.findByIdAndUpdate(id, {
    conversionURL,
  },
  {
    returnOriginal: false,
  });
  //  return updated abtest
  return updatedAbtest;
};

const getAbtest = async (id) => {
  //  get abtest and populate variations, replacing objectid with the variation obj
  const abtest = await Abtest.findById(id).populate('variations');
  //  return abtest with all variations info
  return abtest;
};

const deleteAbtest = async (id) => {
  //  delete abtest
  const abtest = await Abtest.findByIdAndDelete(id);
  //  return deleted abtest
  return abtest;
};

const updateWithNewVariation = async (abtest, variationID) => {
  //  add a new variation to an abtest
  const updatedAbtest = await Abtest.findByIdAndUpdate(abtest, {
    $push: { variations: variationID },
  },
  {
    returnOriginal: false,
  });
  //  return abtest with new variation
  return updatedAbtest;
};

const getAllAbtests = async (id) => {
  //  get all abtest for a user, replace variation obj id with data, and sort by newest first
  const abtestsObj = await Abtest.find({ user: id }).populate('variations').sort('-createdAt');
  //  returns json obj of abtests
  return abtestsObj;
};

const deleteSingleVariation = async (abtest, id) => {
  //  finds an abtest with matching id and deletes variation with provided id
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
