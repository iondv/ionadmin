/**
 * Created by kalias_90 on 14.09.17.
 */

const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');
const respond = require('../../../backend/respond');
const onError = require('../../../backend/error');
const moduleName = require('../../../module-name');

module.exports = function (req, res) {
  ionAdmin.can(req, res, accessResources.schedule.id).then(() => {
    respond(res, (scope) => {
      scope.schedulerAgent.saveJob(
        req.body.job,
        {
          description: req.body.description || '',
          launch: JSON.parse(req.body.launch),
          worker: req.body.worker,
          di: JSON.parse(req.body.di)
        }
      ).then(() => res.redirect(`/${moduleName}/schedule/${req.body.job}`))
        .catch(err => onError(scope, err, res, true));
    });
  }).catch((err) => {
    ionAdmin.error(err, {req, res});
  });
};
