'use strict';

const ionAdmin = require('../../index');
const accessResources = require('../../access-resources');
const Db = require('../../backend/db');
const {t} = require('core/i18n');

exports.index = function (req, res) {
  ionAdmin.can(req, res, accessResources.backup.id).then(permissions => {
    try {
      let db = new Db('ion_meta');
      db.distinct('namespace', {}, {}, (err, namespaces)=> {
        if (err) {
          return ionAdmin.error(err, {req, res});
        }
        ionAdmin.render('backup/db', {
          req,
          res,
          title: t('Backups'),
          permissions: permissions || {},
          namespaces
        });
      });
    } catch (err) {
      ionAdmin.error(err, {req, res});
    }
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};