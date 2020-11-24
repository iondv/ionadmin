const ionAdmin = require('../../index');
const accessResources = require('../../access-resources');
const {t} = require('core/i18n');

exports.index = (req, res) => {
  const result = {
    req, res,
    title: t('Access log'),
    types: ionAdmin.getScope().accessLogger.types()
  };
  return ionAdmin.can(req, res, accessResources.accesslog.id)
    .then(() => ionAdmin.getScope().accounts.list([], true))
    .then((users) => {
      result.users = users.sort((aa, bb) => aa.name().localeCompare(bb.name()));
      result.types = ionAdmin.getScope().accessLogger.types();
      return ionAdmin.render('accesslog/index', result);
    })
    .catch(err => ionAdmin.renderError(req, res, err));
};
