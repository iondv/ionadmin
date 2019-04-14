'use strict';

const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');
const Model = require('../../../models/security/user');

let items = require('../crud')({
  Model,
  resource: accessResources.securityUsers.id
});

module.exports = Object.assign(items, {
  list: function (req, res) {
    ionAdmin.can(req, res, accessResources.securityUsers.id).then(() => {
      try {
        let model = new Model();
        model.findAllWithRoles((err, docs) => {
          if (err) {
            ionAdmin.renderError(req, res, err);
          } else if (docs) {
            res.json(docs);
          }
        });
      } catch (err) {
        ionAdmin.renderError(req, res, err);
      }
    }).catch((err) => {
      ionAdmin.renderError(req, res, err);
    });
  }
});