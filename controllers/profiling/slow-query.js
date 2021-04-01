'use strict';

const ionAdmin = require('../../IonAdmin');
const accessResources = require('../../access-resources');
const model = "profiling/slow-query";
const path = `${model}/`;
const {t} = require('@iondv/i18n');

exports.index = function (req, res) {
  ionAdmin.can(req, res, accessResources.profilingSlowQuery.id).then(permissions => {
    ionAdmin.render(path, {
      req, res,
      title: t('Slow database queries'),
      pageCode: model,
      permissions
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};