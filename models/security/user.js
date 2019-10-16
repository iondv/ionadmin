'use strict';

const Base = require('../base2');
const async = require('async');
const Acl = require('../acl');

class User extends Base {

  cast(u) {
    return {
      id: u.id(),
      login: u.id().split('@')[0],
      name: u.name(),
      type: u.type(),
      email: u.email(),
      pwd: u.pwdHash(),
      disabled: u.isDisabled()
    };
  }

  findAllWithRoles(cb) {
    async.waterfall([
      (cb) => {
        (new Role()).findAll(cb);
      },
      (roles, cb) => {
        roles = this.indexObjectsByKey(roles, 'id');
        this.scope.accounts.list(null, true)
          .then(
            (users) => {
              cb(null, users.map(u => this.cast(u)), roles);
            }
          )
          .catch(cb);
      },
      (users, indexedRoles, cb) => {
        async.eachSeries(
          users,
          (user, cb) => {
            Acl.getRoles(user.id)
              .then(
                (roles) => {
                  user.roles = roles ? roles.map(role => indexedRoles[role]) : [];
                  cb();
                }
              )
              .catch(cb);
          },
          err => cb(err, users)
        );
      }
    ], cb);
  }

  findAll(cb) {
    this.scope.accounts.list(null, true).then(users => cb(null, users.map(u => this.cast(u)))).catch(cb);
  }

  findById(id, cb) {
    this.scope.accounts.get(id, null, true).then(u => cb(null, [this.cast(u)])).catch(cb);
  }

  removeList(ids, cb) {
    let p = Promise.resolve();
    ids.forEach((id) => {
      p = p.then(() => Acl.getRoles(id))
        .then(roles => Acl.getManager().unassignRoles([id], roles))
        .then(() => this.scope.accounts.unregister(id));
    });
    p.then(() => cb(null, ids)).catch(cb);
  }

  findOne (id, cb) {
    let user = null;
    async.waterfall([
      cb => this.findById(id, cb),
      (doc, cb) => {
        if (!doc.length) {
          cb(null, []);
        }
        user = doc[0];
        this.attrs = doc;
        user ?
          Acl.getRoles(user.id)
            .then(roles => cb(null, roles))
            .catch(cb) : cb(null, []);
      }
    ], (err, roles) => {
      if (user) {
        user.roles = roles;
        delete user.pwd;
      }
      cb(err, user);
    });
  }

  insert (data, cb) {
    let roles = data.roles ? data.roles.split(',') : [];
    async.waterfall([
      (cb) => {
        delete data.roles;
        if (data.login) {
          data.id = data.login;
          delete data.login;
        }
        data.needPwdReset = true;
        this.scope.accounts.register(data).then(u => cb(null, this.cast(u))).catch(cb);
      },
      (inserted, cb) => {
        data = inserted;
        delete data.pwd;
        roles.length ? Acl.addUserRoles(inserted.id, roles, cb) : cb();
      }
    ], err => cb(err, data));
  }

  update (id, data, cb) {
    let user = {};
    let roles = data.roles ? data.roles.split(',') : [];
    async.waterfall([
      cb => this.findOne(id, cb),
      (doc, cb) => {
        user = doc;
        if (!data.pwd) {
          return cb();
        }
        this.scope.accounts.setPassword(id, null, data.pwd).then(() => cb()).catch(cb);
      },
      (cb) => {
        delete data.roles;
        if (data.login) {
          data.id = data.login;
          delete data.login;
        }
        data.disabled = !!data.disabled;
        delete data.pwd;
        data.needPwdReset = true;
        this.scope.accounts.set(id, data).then(u => cb(null, u)).catch(cb);
      },
      (result, cb) => {
        user = this.cast(result);
        Acl.getRoles(id).then(roles => cb(null, roles)).catch(cb);
      },
      (roles, cb) => Acl.removeUserRoles(id, roles, cb),
      (cb) => {
        roles.length ? Acl.addUserRoles(user.id, roles, () => {
          user.roles = roles;
          cb();
        }) : cb();
      }
    ], err => cb(err, user));
  }

  remove (id, cb) {
    async.waterfall(
      [
        cb => Acl.getRoles(id).then(roles => cb(null, roles)).catch(cb),
        (roles, cb) => Acl.removeUserRoles(id, roles, cb)
      ],
      err => err ? cb(err) : this.scope.accounts.unregister(id).then(() => cb()).catch(cb)
    );
  }
}

module.exports = User;

const Role = require('./role');