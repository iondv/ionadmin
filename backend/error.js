'use strict';

let Logger = require('core/interfaces/Logger');

module.exports = function (scope, err, res, userMsg) {
  if (scope && scope.sysLog && scope.sysLog instanceof Logger) {
    scope.sysLog.error(err);
  } else {
    console.error(err);
  }
  if (typeof userMsg === 'boolean' && userMsg) {
    userMsg = 'Внутренняя ошибка сервера.';
  }
  if (res) {
    res.status(500).send(userMsg || (err instanceof Error ? err.message : err));
  }
  return false;
};
