'use strict';

const ionAdmin = require('../../IonAdmin');
const { Permissions } = require('@iondv/acl-contracts');

module.exports = function (params) {

  let Model = params.Model;

  function can (permission, req, res, next, cb) {
    ionAdmin.can(req, res, params.resource, permission).then(cb).catch((err) => {
      ionAdmin.renderError(req, res, err);
    });
  }

  return {
    can,

    list: function (req, res, next) {
      can(Permissions.READ, req, res, next, () => {
        let model = new Model();
        model.findAll((err, docs) => {
          if (err) {
            ionAdmin.renderError(req, res, err);
          } else if (docs) {
            res.json(docs);
          }
        });
      });
    },

    get: function (req, res, next) {
      can(Permissions.READ, req, res, next, () => {
        let id = req.params.id;
        let model = new Model();
        model.findOne(id, (err, doc) => {
          if (err) {
            ionAdmin.renderError(req, res, err);
          } else if (doc) {
            res.json(doc);
          } else {
            ionAdmin.renderError(req, res, 404);
          }
        });
      });
    },

    create: function (req, res, next) {
      can(Permissions.WRITE, req, res, next, () => {
        let model = new Model();
        let data = model.filterAttrs(req.body);
        model.insert(data, (err, result) => {
          if (err) {
            ionAdmin.renderError(req, res, err);
          } else {
            res.json(result);
          }
        });
      });
    },

    update: function (req, res, next) {
      can(Permissions.WRITE, req, res, next, () => {
        let id = req.params.id;
        let model = new Model();
        let data = model.filterAttrs(req.body);
        model.update(id, data, (err, result) => {
          if (err) {
            ionAdmin.renderError(req, res, err);
          } else {
            res.json(result);
          }
        });
      });
    },

    delete: function (req, res, next) {
      can(Permissions.DELETE, req, res, next, () => {
        let id = req.params.id;
        let model = new Model();
        model.remove(id, (err, result) => {
          if (err) {
            ionAdmin.renderError(req, res, err);
          } else if (result) {
            res.json(result);
          } else {
            ionAdmin.renderError(req, res, 404);
          }
        });
      });
    },

    deleteList: function (req, res, next) {
      can(Permissions.DELETE, req, res, next, () => {
        let data = req.body.ids;
        let model = new Model();
        model.removeList(data, (err) => {
          if (err) {
            ionAdmin.renderError(req, res, err);
          } else {
            res.json({ids: data});
          }
        });
      });
    }
  };
};