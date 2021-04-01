/**
 * Created by kalias_90 on 14.09.17.
 */

'use strict';

const ionAdmin = require('../../IonAdmin');
const accessResources = require('../../access-resources');
const respond = require('../../backend/respond');
const onError = require('../../backend/error');

const TEMPLATE = 'schedule/job';

module.exports = function (req, res) {
  ionAdmin.can(req, res, accessResources.schedule.id).then(() => {
    respond(res, (scope) => {
      scope.schedulerAgent.getJob(req.params.job)
        .then((job) => {
          ionAdmin.render(TEMPLATE, {
            req, res,
            title: req.params.job,
            job
          });
        })
        .catch((err) => {
          onError(scope, err, res, true);
        });
    });
  }).catch((err) => {
    ionAdmin.renderError(req, res, err);
  });
};