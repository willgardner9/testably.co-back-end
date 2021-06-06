const variationService = require('./variation.service');
const abtestService = require('../abtest/abtest.service');

const postVariation = async (req, res) => {
  const { abtest, variable } = req.body;
  //  create new variation
  const newVariation = await variationService.createNewVariation(abtest, variable);
  //  save reference to variation in abtest doc
  const variationID = newVariation.id;
  const updatedAbtest = await abtestService.updateWithNewVariation(abtest, variationID);

  res.json({ newVariation, updatedAbtest });
};

const patchVariation = async (req, res) => {
  const { id, sessions, conversions } = req.body || null;
  const patchedVariation = await variationService.patchVariation(id, sessions, conversions);
  res.json(patchedVariation);
};

const getSingleVariation = async (req, res) => {
  const { id } = req.params;
  const singleVariation = await variationService.getSingleVariation(id);
  res.json(singleVariation);
};

const deleteVariation = async (req, res) => {
  const { id } = req.params;
  //  delete variation
  const deletedVariation = await variationService.deleteVariation(id);
  //  delete references to variation in abtest
  const { abtest } = deletedVariation;
  const updatedAbtest = await abtestService.deleteSingleVariation(abtest, id);
  res.json({ deletedVariation, updatedAbtest });
};

module.exports = {
  postVariation,
  patchVariation,
  getSingleVariation,
  deleteVariation,
};
