'use strict';

const Base = require('../base2');
const async = require('async');
const Acl = require('../acl');

class Role extends Base {

  findAllWithUsers (cb) {
    async.waterfall([
      (cb) => {
        this.findAll((err, roles) => cb(err, roles));
      },
      (roles, cb) => {
        async.eachSeries(roles, (role, cb) => {
          Acl.getRoleUsers(role.id, (err, users) => {
            if (err) {
              return cb(err);
            }
            role.users = users;
            cb();
          });
        }, err => cb(err, roles));
      }
    ], cb);
  }

  findAll(cb) {
    Acl.getManager().getRoles().then(roles => cb(null, roles)).catch(cb);
  }

  findById(id, cb) {
    Acl.getManager().getRole(id).then(role => cb(null, [role])).catch(cb);
  }

  removeList(ids, cb) {
    Acl.getManager().undefineRoles(ids).then(() => cb()).catch(cb);
  }

  findOne (id, cb) {
    let item = {};
    async.waterfall(
      [
        (cb) => {
          Acl.getManager().getRole(id)
            .then((role) => {
              this.attrs = role;
              cb(null, role);
            })
            .catch(cb);
        },
        (doc, cb) => {
          item = doc;
          item ? this.constructor.getResourceAccess(doc.id, cb) : cb();
        }
      ],
      (err, access) => {
        if (item) {
          item.access = access;
        }
        cb(err, item);
      }
    );
  }

  insert (data, cb) {
    try {
      var access = JSON.parse(data.access);
    } catch (err) {
      access = {};
    }
    async.waterfall(
      [
        (cb) => {
          delete data.access;
          Acl.getManager().defineRole(data.id, data.name).then(() => cb(null, data)).catch(cb);
        },
        (inserted, cb) => {
          async.forEachOfSeries(
            access,
            (permissions, resource, cb) => {
              this.constructor.setResourceAccess(data.id, resource, permissions, cb);
            },
            cb
          );
        }
      ],
      (err) => {
        cb(err, data);
      }
    );
  }

  update (id, data, cb) {
    try {
      var access = JSON.parse(data.access);
    } catch (err) {
      access = {};
    }
    async.waterfall([
      (cb) => {
        this.findOne(id, cb);
      },
      (role, cb) => {
        role ? Acl.clearAllRolePemissions(role.id, cb) : cb();
      },
      (cb) => {
        delete data.access;
        Acl.getManager().defineRole(data.id, data.name)
          .then(() => (id !== data.id) ? Acl.getManager().undefineRoles([id]) : null)
          .then(() => cb(null, data)).catch(cb);
      },
      (result, cb) => {
        async.forEachOfSeries(access, (permissions, resource, cb) => {
          if (permissions instanceof Array && permissions.length) {
            this.constructor.setResourceAccess(data.id, resource, permissions, cb);
          } else {
            cb();
          }
        }, cb);
      }
    ], err => cb(err, data));
  }

  remove (id, cb) {
    Acl.getManager().undefineRoles([id]).then(() => cb()).catch(cb);
  }

  static getResourceAccess (id, cb) {
    Acl.getManager().getResources(id)
      .then(resources => Acl.getAcl().getPermissions(id, resources.map(r => r.id), true))
      .then((access) => {
        for (let res in access) {
          if (access.hasOwnProperty(res)) {
            access[res] = Object.keys(access[res]);
          }
        }
        cb(null, access);
      })
      .catch(cb);
  }

  static setResourceAccess (id, resource, permissions, cb) {
    Acl.grant(id, resource, permissions).then(() => cb()).catch(cb);
  }

  static sync (cb) {
    cb();
  }
}

module.exports = Role;

const User = require('./user');
