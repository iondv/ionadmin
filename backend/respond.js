'use strict';

let di = require('core/di');
let moduleName = require('../module-name');
const onError = require('./error');
const {t} = require('core/i18n');
const {format} = require('util');

module.exports = function (res, cb, required) {
  var scope = di.context(moduleName);
  if (!scope) {
    return onError(scope, new Error(format(t('DI-container %s not found'), moduleName)), res, true);
  }
  if (Array.isArray(required)) {
    for (var i = 0; i < required.length; i++) {
      if (typeof scope[required[i]] === 'undefined' || !scope[required[i]]) {
        return onError(scope, new Error(format(t('Required component %s not set up'), required[i])), res, true);
      }
    }
  }
  cb(scope);
};
