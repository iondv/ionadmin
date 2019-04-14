/**
 * Created by kalias_90 on 14.09.17.
 */

const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');
const respond = require('../../../backend/respond');
const onError = require('../../../backend/error');

module.exports = function (req, res) {
  ionAdmin.can(req, res, accessResources.schedule.id).then(() => {
    respond(res, (scope) => {
      scope.schedulerAgent.removeJob(req.body.job)
        .then(() => res.status(200).send(true))
        .catch(err => onError(scope, err, res, true));
    });
  }).catch((err) => {
    ionAdmin.error(err, {req, res});
  });
};

