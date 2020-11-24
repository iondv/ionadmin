'use strict';

const {t} = require('core/i18n');
let Logger = require('core/interfaces/Logger');

module.exports = function (scope, err, res, userMsg) {
  if (scope && scope.sysLog && scope.sysLog instanceof Logger) {
    scope.sysLog.error(err);
  } else {
    console.error(err);
  }
  if (typeof userMsg === 'boolean' && userMsg) {
    userMsg = t('Internal server error.', {lang: res ? res.locals.lang : null});
  }
  if (res) {
    res.status(500).send(userMsg || (err instanceof Error ? err.getMessage(res.locals.lang) : err));
  }
  return false;
};
