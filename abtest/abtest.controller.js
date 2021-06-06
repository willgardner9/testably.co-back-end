const abtestService = require('./abtest.service');
const variationService = require('../variation/variation.service');

const postAbtest = async (req, res) => {
  const { user, type, conversionURL } = req.body;
  const newAbtest = await abtestService.createNewAbtest(user, type, conversionURL);
  res.json(newAbtest);
};

const updateAbtest = async (req, res) => {
  const { id } = req.params;
  const { conversionURL } = req.body;
  const updatedAbtest = await abtestService.updateAbtest(id, conversionURL);
  res.json(updatedAbtest);
};

const getAbtest = async (req, res) => {
  const { id } = req.params;
  const abtest = await abtestService.getAbtest(id);
  res.json(abtest);
};

const getAllAbtests = async (req, res) => {
  console.log(req);
  const { user } = req.query;
  const abtestsObj = await abtestService.getAllAbtests(user);
  res.json(abtestsObj);
};

const deleteAbtest = async (req, res) => {
  const { id } = req.params;
  const abtestDeleted = await abtestService.deleteAbtest(id);
  const variationsDeleted = await variationService.deleteVariations(id);
  res.json({ abtestDeleted, variationsDeleted });
};

module.exports = {
  postAbtest,
  getAbtest,
  updateAbtest,
  getAllAbtests,
  deleteAbtest,
};
