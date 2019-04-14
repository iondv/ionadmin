'use strict';

const ionAdmin = require('../../index');
const accessResources = require('../../access-resources');
const Permissions = require('core/Permissions');
const model = "notifications";
const path = `${model}/`;
const locale = require('locale');

exports.index = function (req, res) {
  ionAdmin.can(req, res, accessResources.notify.id).then(permissions => {
    let locales = new locale.Locales(req.headers['accept-language']);
    let lang = locales[0] ? locales[0].language : 'ru';
    ionAdmin.render(path, {
      req, res,
      title: 'Уведомления',
      pageCode: model,
      permissions
    }, lang);
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};

exports.create = function (req, res) {
  ionAdmin.can(req, res, accessResources.notify.id, Permissions.WRITE).then(permissions => {
    ionAdmin.render(`${path}form`, {
      req, res,
      title: 'Создать уведомление',
      pageCode: model,
      scenario: 'create',
      permissions
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};

exports.update = function (req, res) {
  ionAdmin.can(req, res, accessResources.notify.id, Permissions.WRITE).then(permissions => {
    ionAdmin.render(`${path}form`, {
      req, res,
      title: 'Просмотреть уведомление',
      pageCode: model,
      scenario: 'update',
      permissions,
      readOnly: true
    });
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};