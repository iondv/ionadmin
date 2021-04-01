/**
 * Created by kalias_90 on 13.09.17.
 */
'use strict';

const ionAdmin = require('../../IonAdmin');
const accessResources = require('../../access-resources');
const respond = require('../../backend/respond');
const onError = require('../../backend/error');
const {t} = require('@iondv/i18n');

const TEMPLATE = 'schedule/index';

module.exports = function (req, res) {
  ionAdmin.can(req, res, accessResources.schedule.id).then(() => {
    respond(res, (scope) => {
      scope.schedulerAgent.getJobs()
        .then((jobs) => {
          ionAdmin.render(TEMPLATE, {
            req, res,
            title: t('Scheduling management'),
            jobs,
            runningModes: scope.schedulerAgent.statusCodes(),
            manuallyCheckInterval: scope.settings.get(req.moduleName + '.' + 'manuallyCheckInterval') || 30000
          });
        })
        .catch((err) => {
          onError(scope, err, res, true);
        });
    }, ['schedulerAgent']);
  }).catch((err) => {
    ionAdmin.renderError(req, res, err);
  });
};
