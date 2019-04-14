'use strict';

let ionAdmin = require('../index');

module.exports = function (req, res, next) {
  try {
    ionAdmin.render('default', {req, res});
  } catch (err) {
    ionAdmin.error(err, {req, res});
  }
};
