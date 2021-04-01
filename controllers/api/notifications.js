'use strict';

const ionAdmin = require('../../IonAdmin');
const accessResources = require('../../access-resources');
const { Permissions } = require('@iondv/acl-contracts');
const onError = require('../../backend/error');
const { di } = require('@iondv/core');
const moment = require('moment');

function can(scope, permission, req, res, next, cb) {
  ionAdmin
    .can(req, res, accessResources.notify.id, permission)
    .then(cb)
    .catch(err => {
      onError(scope, err, res, true);
    });
}

module.exports = {
  userSearch: function (req, res, next) {
    let scope = di.context(req.moduleName);
    ionAdmin.can(req, res, accessResources.securityUsers.id, Permissions.READ)
      .then(() => {
        return scope.accounts.search(req.query.search)
          .then((list) => {
            var users = [];
            for(var i = 0; i < list.length; i++) {
              users.push(list[i].id());
            }
            res.json(users);
          });
      })
      .catch(err => {
        onError(scope, err, res, true);
      });
  },

  list: function (req, res, next) {
    let scope = di.context(req.moduleName);
    can(scope, Permissions.READ, req, res, next,
      () => {
        let reciever = null;
        let opts = {
          countTotal: true
        };
        if (req.query.start) {
          opts.offset = parseInt(req.query.start);
        }
        if (req.query.length) {
          opts.count = parseInt(req.query.length);
        }
        if (req.query.reciever) {
          reciever = req.query.reciever;
        }
        if (req.query.sender) {
          opts.sender = req.query.sender;
        }
        if (req.query.since) {
          opts.since = moment(req.query.since).toDate();
        }

        return scope.notifier
          .list(reciever, opts)
          .then((list) => {
            res.json(list);
          });
      }
    );
  },

  get: function (req, res, next) {
    let scope = di.context(req.moduleName);
    can(scope, Permissions.READ, req, res, next, () => {
      let id = req.params.id;
      scope.notifier
        .get(id)
        .then((n) => {
          if (n) {
            res.json(n);
          } else {
            res.sendStatus(404);
          }
        })
        .catch((err) => {
          onError(scope, err, res, true);
        });
    });
  },

  create: function (req, res, next) {
    let scope = di.context(req.moduleName);
    can(scope, Permissions.WRITE, req, res, next, () => {
      scope.notifier
        .notify({
          sender: scope.auth.getUser(req).id(),
          recievers: req.body['obj-recievers'],
          subject: req.body['obj-subject'],
          message: req.body['obj-message']
        })
        .then((n) => res.json(n))
        .catch((err) => {
          onError(scope, err, res, true);
        });
    });
  },

  delete: function (req, res, next) {
    let scope = di.context(req.moduleName);
    can(scope, Permissions.DELETE, req, res, next, ()=> {
      scope.notifier.withdraw(req.params.id)
        .then(() => res.sendStatus(200))
        .catch((err) => {
          onError(scope, err, res, true);
        });
    });
  },

  deleteList: function (req, res, next) {
    let scope = di.context(req.moduleName);
    can(scope, Permissions.DELETE, req, res, next, ()=> {
      let ids = req.body.ids;
      if (Array.isArray(ids)) {
        let p = Promise.resolve();
        ids.forEach((id) => {
          console.log(id);
          p = p.then(() => scope.notifier.withdraw(id));
        });
        p
          .then(() => res.sendStatus(200))
          .catch((err) => {
            onError(scope, err, res, true);
          });
      }
    });
  }
};
