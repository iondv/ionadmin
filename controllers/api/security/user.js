const ionAdmin = require('../../../IonAdmin');
const accessResources = require('../../../access-resources');
const model = require('../../../models/security/user')(() => ionAdmin.getScope());

const items = require('../crud2')(model,
  () => ionAdmin.getScope(),
  (req, res, permissions) => ionAdmin.can(req, res, accessResources.securityUsers.id, permissions),
  (req, res, err) => ionAdmin.renderError(req, res, err));

items.list = (req, res) => items.wrapper(req, res,
  scope => model.findAllWithRoles().then(docs => res.json(docs)));

module.exports = items;
