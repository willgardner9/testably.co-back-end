const variationService = require('./variation.service');
const abtestService = require('../abtest/abtest.service');

const postVariation = async (req, res) => {
  //  extract abtest reference and new variation from request object
  const { abtest, variable } = req.body;
  //  create new variation and save to db
  const newVariation = await variationService.createNewVariation(abtest, variable);
  //  save reference to variation in abtest doc in db
  const variationID = newVariation.id;
  const updatedAbtest = await abtestService.updateWithNewVariation(abtest, variationID);
  //  return new variation and abtest with new variation saved in it to client
  res.json({ newVariation, updatedAbtest });
};

const patchVariation = async (req, res) => {
  //  extract variation id and sessions/conversions booleans from request object
  const { id, sessions, conversions } = req.body || null;
  const patchedVariation = await variationService.patchVariation(id, sessions, conversions);
  //  return variation with update to sessions/conversions
  res.json(patchedVariation);
};

const getSingleVariation = async (req, res) => {
  //  extract variaion id from request
  const { id } = req.params;
  //  find variation in db
  const singleVariation = await variationService.getSingleVariation(id);
  //  return variation
  res.json(singleVariation);
};

const deleteVariation = async (req, res) => {
  //  extract variation id from request
  const { id } = req.params;
  //  delete variation
  const deletedVariation = await variationService.deleteVariation(id);
  //  delete references to variation in abtest
  const { abtest } = deletedVariation;
  const updatedAbtest = await abtestService.deleteSingleVariation(abtest, id);
  //  return deleted variation and the abtest without the variation back to client
  res.json({ deletedVariation, updatedAbtest });
};

module.exports = {
  postVariation,
  patchVariation,
  getSingleVariation,
  deleteVariation,
};
