'use strict';

const ionAdmin = require('../../index');
const accessResources = require('../../access-resources');
const UserTypes = require('core/UserTypes');
const Permissions = require('core/Permissions');
const {t} = require('core/i18n');

module.exports = function (req, res) {
  ionAdmin.can(req, res, accessResources.token.id, Permissions.USE).then(permissions => {
    try {
      if (req.method === 'GET') {
        ionAdmin.render('token/index', {
          req, res,
          title: t('Security token generator'),
          login: '',
          type: UserTypes.SYSTEM,
          permissions
        });
      } else if (req.method === 'POST') {
        ionAdmin.getScope().wsAuth
          .generateToken(req.body.login, req.body.type)
          .then((token) => {
            ionAdmin.render('token/index', {
              req, res,
              login: req.body.login,
              type: req.body.type,
              token: token,
              title: t('Security token generator'),
              permissions
            });
          })
          .catch((err)=>ionAdmin.renderError(req, res, err));

      }
    } catch (err) {
      ionAdmin.renderError(req, res, err);
    }
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};