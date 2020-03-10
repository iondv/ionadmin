const moduleName = require('../../../module-name');
const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');
const model = require('../../../models/security/role')(() => ionAdmin.getScope());

const items = require('../crud2')(model,
  () => ionAdmin.getScope(),
  (req, res, permissions) => ionAdmin.can(req, res, accessResources.securityRoles.id, permissions),
  (req, res, err) => ionAdmin.renderError(req, res, err));

items.resources = (req, res) => items.wrapper(req, res,
  scope => scope.roleAccessManager.getResources()
    .then(docs => (docs || []).sort((a, b) => (typeof a.name === 'string' ? a.name : '')
      .localeCompare((typeof b.name === 'string' ? b.name : ''))))
    .then((docs) => {
      const resTypes = (scope.settings.get(`${moduleName}.securityParams`) || {}
      ).resourceTypes || {};
      const result = {'*': []};
      docs.forEach((doc) => {
        if (doc.id === '*' && doc.name === '*')
          doc.name = 'Все';
        let classified = false;
        Object.keys(resTypes).forEach((type) => {
          if (type !== '*' && (new RegExp(`^${type}`)).test(doc.id)) {
            if (!result[type])
              result[type] = [];
            result[type].push(doc);
            classified = true;
          }
        });
        if (!classified)
          result['*'].push(doc);
      });
      return result;
    })
    .then(results => res.json(results)));

items.list = (req, res) => items.wrapper(req, res,
  scope => model.findAllWithUsers().then(docs => res.json(docs || [])));

items.listDefault = (req, res) => items.wrapper(req, res,
  scope => model.findAll()
    .then((docs) => {
      let result = [];
      if (Array.isArray(docs)) {
        const params = ionAdmin.getSettings('securityParams');
        if (Array.isArray(params.hiddenRoles)) {
          params.hiddenRoles.forEach((role) => {
            docs.forEach((doc) => {
              if (!(new RegExp(role)).test(doc.id))
                result.push(doc);
            });
          });
        } else {
          result = docs;
        }
      }
      return result;
    })
    .then(results => res.json(results)));

module.exports = items;
