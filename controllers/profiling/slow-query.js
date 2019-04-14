'use strict';

const ionAdmin = require('../../index');
const accessResources = require('../../access-resources');
const model = "profiling/slow-query";
const path = `${model}/`;

exports.index = function (req, res) {
  ionAdmin.can(req, res, accessResources.profilingSlowQuery.id).then(permissions => {
    ionAdmin.render(path, {
      req, res,
      title: 'Медленные запросы к базе данных',
      pageCode: model,
      permissions
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};