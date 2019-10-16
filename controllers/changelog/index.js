'use strict';

const async = require('async');
const ionAdmin = require('../../index');
const accessResources = require('../../access-resources');
const Db = require('../../backend/db');

exports.index = function (req, res, next) {
  ionAdmin.can(req, res, accessResources.changelog.id).then(()=> {
    try {
      async.series({
        users: cb => (new Db('ion_user')).find({}, cb),
        classes: cb => (new Db('ion_meta')).find({}, cb)
      }, (err, result)=> {
        if (err) {
          return ionAdmin.error(err, {req, res});
        }
        result.users.sort((a, b)=> a.name.localeCompare(b.name));
        result.classes.sort((a, b)=> a.caption.localeCompare(b.caption));
        ionAdmin.render('changelog/index', Object.assign({
          req, res,
          title: 'Change log'
        }, result));
      });
    } catch (err) {
      ionAdmin.error(err, {req, res});
    }
  }).catch(err => {
    ionAdmin.renderError(req, res, err);
  });
};