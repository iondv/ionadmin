/**
 * Created by kalias_90 on 04.04.18.
 */

const ionAdmin = require('../../../IonAdmin');
const accessResources = require('../../../access-resources');
const respond = require('../../../backend/respond');
const onError = require('../../../backend/error');

module.exports = function (req, res) {
  ionAdmin.can(req, res, accessResources.schedule.id).then(() => {
    respond(res, (scope) => {
      scope.schedulerAgent.status(req.body.job)
        .then(status => res.json(status))
        .catch((err) => {
          onError(scope, err, res, true);
        });
    });
  }).catch((err) => {
    ionAdmin.error(err, {req, res});
  });
};