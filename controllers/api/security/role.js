'use strict';

const moduleName = require('../../../module-name');
const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');
const Model = require('../../../models/security/role');
const Resource = require('../../../models/security/resource');
const Permissions = require('core/Permissions');

let items = require('../crud')({
  Model,
  resource: accessResources.securityRoles.id
});

module.exports = Object.assign(items, {

  resources: function (req, res) {
    ionAdmin.can(req, res, accessResources.securityRoles.id).then(() => {
      let params = ionAdmin.getScope().settings.get(`${moduleName}.securityParams`) || {};
      let resTypes = params.resourceTypes || {};
      try {
        (new Resource()).findAll((err, docs) => {
          if (err) {
            return res.status(500).send(err);
          }
          docs = docs || [];
          docs = docs.sort((a, b) => (typeof a.name === 'string' ? a.name : '').localeCompare((typeof b.name === 'string' ? b.name : '')));
          let result = {'*': []};
          let checkers = {};
          Object.keys(resTypes).forEach((k) => {
            if (k !== '*') {
              result[k] = [];
              checkers[k] = new RegExp(`^${k}`);
            }
          });
          let accessKeys = [];
          docs.forEach((d) => {
            if (d.id === '*' && d.name === '*') {
              d.name = 'Все';
            }
            accessKeys.push(d.id);
            let classified = false;
            Object.keys(checkers).forEach((k) => {
              if (checkers[k].test(d.id)) {
                result[k].push(d);
                classified = true;
              }
            });
            if (!classified) {
              result['*'].push(d);
            }
          });
          res.json(result);
        });
      } catch (err) {
        console.error(err);
      }
    }).catch((err) => {
      ionAdmin.renderError(req, res, err);
    });
  },

  list: function (req, res) {
    ionAdmin.can(req, res, accessResources.securityRoles.id).then(() => {
      let model = new Model();
      model.findAllWithUsers((err, docs) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json(docs || []);
      });
    }).catch((err) => {
      ionAdmin.renderError(req, res, err);
    });
  },

  listDefault: function (req, res, next) {
    items.can(Permissions.READ, req, res, next, () => {
      let model = new Model();
      model.findAll((err, docs) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json(filterRoles(docs));
      });
    });
  }
});

function filterRoles (docs) {
  if (!(docs instanceof Array)) {
    return [];
  }
  let params = ionAdmin.getSettings('securityParams');
  let hiddenRoles = params && params.hiddenRoles;
  if (!(hiddenRoles instanceof Array)) {
    return docs;
  }
  hiddenRoles = hiddenRoles.map((role) => {
    try {
      return new RegExp(role);
    } catch (e) {
      return false;
    }
  });
  return docs.filter((doc) => {
    for (let role of hiddenRoles) {
      if (role && role.test(doc.id)) {
        return false;
      }
    }
    return true;
  });
}