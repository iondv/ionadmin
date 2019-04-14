'use strict';

let di = require('core/di');
let moduleName = require('../module-name');
const onError = require('./error');

module.exports = function (res, cb, required) {
  var scope = di.context(moduleName);
  if (!scope) {
    return onError(scope, new Error('Не найден DI-контейнер ' + moduleName), res, true);
  }
  if (Array.isArray(required)) {
    for (var i = 0; i < required.length; i++) {
      if (typeof scope[required[i]] === 'undefined' || !scope[required[i]]) {
        return onError(scope, new Error('Не настроен необходимый компонент ' + required[i]), res, true);
      }
    }
  }
  cb(scope);
};
