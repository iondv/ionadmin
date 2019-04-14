'use strict';

const accessResources = require('../../../access-resources');
const Model = require('../../../models/security/resource');

module.exports = require('../crud')({
  Model,
  resource: accessResources.securityResources.id
});