'use strict';

const moduleName = require('./module-name');
const di = require('core/di');
const Permissions = require('core/Permissions');
const moment = require('moment-timezone');
const {t} = require('core/i18n');

class IonAdmin {

  render (template, data, lang) {
    let scope = this.getScope();
    if (lang) {
      data.locale = Object.assign({
        lang: lang,
        dateFormat: moment.localeData(lang).longDateFormat('L'),
        dateTimeFormat: moment.localeData(lang).longDateFormat('L') + ' ' + moment.localeData(lang).longDateFormat('LT')
      }, data.locale);
    }
    data = Object.assign({
      baseUrl: data.req.app.locals.baseUrl,
      module: moduleName,
      scenario: 'default',
      title: '{page title}',
      user: this.getUser(data.req),
      menuExt: scope.settings.get(`${moduleName}.mainMenu`) || [],
      securityParams: scope.settings.get(`${moduleName}.securityParams`) || {},
      Permissions,
      permissions: {}
    }, data);
    data.res.render(template, data);
  }

  getScope () {
    return di.context(moduleName);
  }

  getUser (req) {
    return this.getScope().auth.getUser(req);
  }

  error (err, data) {
    data = Object.assign({
      module: moduleName
    }, data);
    console.error(err);
    data.res.send(err);
  }

  getSettings (name) {
    return this.getScope().settings.get(`${moduleName}.${name}`);
  }

  renderError (req, res, err) {
    console.error(err);
    let status = err === 404 ? 404 : err === 403 ? 403 : 500;
    res.status(status);
    if (req.xhr) {
      if (err.getMessage) {
        res.send(err.getMessage(req.locals.lang));
      } else {
        switch (status) {
          case 403: res.send(t('Access denied')); break;
          case 404: res.send(t('Resource not found')); break;
          default: res.send(t('Server error')); break;
        }
      }
    } else {
      this.render(`errors/${status}`, {req, res, err, title: status});
    }
  }

  can (req, res, resource, permission = Permissions.READ) {
    let scope = this.getScope();
    let user = scope.auth.getUser(req);
    return scope.aclProvider.checkAccess(user, resource, permission)
      .then((allow) => {
        if (!allow) {
          return this.renderError(req, res, 403);
        }
        return this.getPermissions(req, resource);
      })
      .catch((err) => {
        this.renderError(req, res, err);
      });
  }

  getPermissions (req, resource) {
    let scope = this.getScope();
    let user = scope.auth.getUser(req);
    return scope.aclProvider.getPermissions(user.id(), resource)
      .then(permissions => permissions && typeof resource === 'string' ? permissions[resource] : permissions);
  }
}
module.exports = new IonAdmin();
