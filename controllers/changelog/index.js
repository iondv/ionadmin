const ionAdmin = require('../../index');
const accessResources = require('../../access-resources');

exports.index = (req, res) => {
  const scope = ionAdmin.getScope();
  const result = {
    req, res,
    title: 'Журнал изменений'
  };
  return ionAdmin.can(req, res, accessResources.changelog.id)
    .then(() => scope.accounts.list([], true))
    .then((users) => {
      result.users = users.sort((aa, bb) => aa.name().localeCompare(bb.name()));
      return scope.metaRepo.listMeta();
    })
    .then((classes) => {
      result.classes = classes.sort((aa, bb) => aa.getCaption().localeCompare(bb.getCaption()));
      return ionAdmin.render('changelog/index', result);
    })
    .catch(err => ionAdmin.renderError(req, res, err));
};
