const ionAdmin = require('../../../IonAdmin');
const accessResources = require('../../../access-resources');
const model = require('../../../models/security/resource')(() => ionAdmin.getScope());

module.exports = require('../crud2')(model,
  () => ionAdmin.getScope(),
  (req, res, permissions) => ionAdmin.can(req, res, accessResources.securityResources.id, permissions),
  (req, res, err) => ionAdmin.renderError(req, res, err));
