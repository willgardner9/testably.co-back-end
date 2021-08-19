const abtestService = require('./abtest.service');
const variationService = require('../variation/variation.service');

const postAbtest = async (req, res) => {
  //  extract abtest info from request object
  const {
    user, type, name, conversionURL,
  } = req.body;
  //  create new abtest
  const newAbtest = await abtestService.createNewAbtest(user, type, name, conversionURL);
  //  return abtest to client
  res.json(newAbtest);
};

const updateAbtest = async (req, res) => {
  //  extract id and updated conversion url from request body
  //  abtest names are immutable
  const { id } = req.params;
  const { conversionURL } = req.body;
  //  updates abtest
  const updatedAbtest = await abtestService.updateAbtest(id, conversionURL);
  //  returns updated abtest to client
  res.json(updatedAbtest);
};

const getAbtest = async (req, res) => {
  //  extract id from req object
  const { id } = req.params;
  //  get single abtest from db
  const abtest = await abtestService.getAbtest(id);
  //  return abtest to client
  res.json(abtest);
};

const getAllAbtests = async (req, res) => {
  //  extract user id from req obj
  const { user } = req.query;
  //  get all abtests associated with supplied user
  const abtestsObj = await abtestService.getAllAbtests(user);
  //  return json object of all abtests
  res.json(abtestsObj);
};

const deleteAbtest = async (req, res) => {
  //  extract abtest id from req obj
  const { id } = req.params;
  //  delete ab test
  const abtestDeleted = await abtestService.deleteAbtest(id);
  //  delete all variations associated with abtest
  const variationsDeleted = await variationService.deleteVariations(id);
  //  return deleted abtest and deleted variations to client
  res.json({ abtestDeleted, variationsDeleted });
};

module.exports = {
  postAbtest,
  getAbtest,
  updateAbtest,
  getAllAbtests,
  deleteAbtest,
};
