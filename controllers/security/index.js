'use strict';

const ionAdmin = require('../../index');
const accessResources = require('../../access-resources');
const {t} = require('core/i18n');

exports.sync = function (req, res) {
  ionAdmin.can(req, res, accessResources.securitySync.id).then(permissions => {
    try {
      ionAdmin.render('security/sync', {
        req, res,
        title: t('Sync'),
        permissions
      });
    } catch (err) {
      ionAdmin.renderError(req, res, err);
    }
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};