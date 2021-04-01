'use strict';

const ionAdmin = require('../../IonAdmin');
const accessResources = require('../../access-resources');
const { Permissions } = require('@iondv/acl-contracts');
const {t} = require('@iondv/i18n');
const model = "security/role";
const path = `${model}/`;

exports.index = function (req, res) {
  ionAdmin.can(req, res, accessResources.securityRoles.id).then(permissions => {
    ionAdmin.render(path, {
      req, res,
      title: t('User roles'),
      pageCode: model,
      permissions
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};

exports.create = function (req, res) {
  ionAdmin.can(req, res, accessResources.securityRoles.id, Permissions.WRITE).then(permissions => {
    ionAdmin.render(`${path}form`, {
      req, res,
      title: t('Create role'),
      pageCode: model,
      scenario: 'create',
      permissions
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};

exports.update = function (req, res) {
  ionAdmin.can(req, res, accessResources.securityRoles.id, Permissions.WRITE).then(permissions => {
    ionAdmin.render(`${path}form`, {
      req, res,
      title: t('Edit role'),
      pageCode: model,
      scenario: 'update',
      permissions
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};