'use strict';

const ionAdmin = require('../../index');
const accessResources = require('../../access-resources');
const Permissions = require('core/Permissions');
const {t} = require('core/i18n');
const model = "security/resource";
const path = `${model}/`;

exports.index = function (req, res) {
  ionAdmin.can(req, res, accessResources.securityResources.id).then(permissions => {
    ionAdmin.render(path, {
      req, res,
      title: t('Resources'),
      pageCode: model,
      permissions
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};

exports.create = function (req, res) {
  ionAdmin.can(req, res, accessResources.securityResources.id, Permissions.WRITE).then(permissions => {
    ionAdmin.render(`${path}form`, {
      req, res,
      title: t('Create resource'),
      pageCode: model,
      scenario: 'create',
      permissions
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};

exports.update = function (req, res) {
  ionAdmin.can(req, res, accessResources.securityResources.id, Permissions.WRITE).then(permissions => {
    ionAdmin.render(`${path}form`, {
      req, res,
      title: t('Edit resource'),
      pageCode: model,
      scenario: 'update',
      permissions
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};