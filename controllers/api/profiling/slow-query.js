'use strict';

const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');
const Permissions = require('core/Permissions');
const Model = require('../../../models/profiling/slow-query');

let crud = require('../crud')({
  Model,
  resource: accessResources.profilingSlowQuery.id
});

module.exports = Object.assign(crud, {

  importNew: function (req, res, next) {
    ionAdmin.can(req, res, accessResources.profilingSlowQuery.id, Permissions.WRITE).then(()=> {
      let model = new Model;
      model.importNew(err => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send('done');
        }
      });
    }).catch(err => {
      ionAdmin.renderError(req, res, err);
    });
  },

  importAll: function (req, res, next) {
    ionAdmin.can(req, res, accessResources.profilingSlowQuery.id, Permissions.WRITE).then(()=> {
      let model = new Model;
      model.importAll(err => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send('done');
        }
      });
    }).catch(err => {
      ionAdmin.renderError(req, res, err);
    });
  },

  getLevel: function (req, res, next) {
    ionAdmin.can(req, res, accessResources.profilingSlowQuery.id).then(()=> {
      let model = new Model;
      model.db.connection.command({profile:-1}, (err, level)=> {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(level);
        }
      });
    }).catch(err => {
      ionAdmin.renderError(req, res, err);
    });
  },

  setLevel: function (req, res, next) {
    ionAdmin.can(req, res, accessResources.profilingSlowQuery.id, Permissions.WRITE).then(()=> {
      var level = parseInt(req.body.level);
      level = isNaN(level) || level < 0 || level > 2 ? 0 : level;
      var threshold = parseInt(req.body.threshold);
      threshold = isNaN(threshold) || threshold < 1 ? 100 : threshold;
      let model = new Model;
      model.db.connection.command({
        profile: level,
        slowms: threshold
      }, (err, level)=> {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(level);
        }
      });
    }).catch(err => {
      ionAdmin.renderError(req, res, err);
    });
  }
});