const ionAdmin = require('../../index');
const access = require('../../access-resources').recache;
const respond = require('../../backend/respond');
const onError = require('../../backend/error');

const TEMPLATE = 'recache/index';

// eslint-disable-next-line func-names
module.exports = function(req, res) {
  ionAdmin.can(req, res, access.id)
    .then(() => respond(res, (scope) => {
      try {
        ionAdmin.render(TEMPLATE, {
          req, res,
          title: 'Пересчет кешей семантики'
        });
      } catch (err) {
        onError(scope, err, res, true);
      }
    }))
    .catch((err) => {
      ionAdmin.renderError(req, res, err);
    });
};
