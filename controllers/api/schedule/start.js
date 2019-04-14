/**
 * Created by kalias_90 on 13.09.17.
 */

const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');
const respond = require('../../../backend/respond');
const onError = require('../../../backend/error');

module.exports = function (req, res) {
  ionAdmin.can(req, res, accessResources.schedule.id).then(() => {
    respond(res, (scope) => {
      let job = req.body.job;
      job && scope.schedulerAgent.run(job)
        .then(status => res.json(status))
        .catch(err => onError(scope, err, res, true));
    });
  }).catch((err) => {
    ionAdmin.error(err, {req, res});
  });
};
