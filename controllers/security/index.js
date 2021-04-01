'use strict';

const ionAdmin = require('../../IonAdmin');
const accessResources = require('../../access-resources');
const {t} = require('@iondv/i18n');

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