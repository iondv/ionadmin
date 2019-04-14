'use strict';

const Base = require('../base2');
const Acl = require('../acl');
const Role = require('./role');
const async = require('async');

module.exports = class Resource extends Base {

  static findIndexedAll (cb) {
    (new Resource()).findAll((err, docs) => {
      if (err) {
        return cb(err);
      }
      cb(null, Base.indexBy('id', docs));
    });
  }

  findOne(id, cb) {
    this.scope.roleAccessManager
      .getResource(id)
      .then((result) => {
        this.attrs = result;
        cb(null, this.attrs);
      })
      .catch(err => cb(err));
  }

  find(prefix, cb) {
    this.scope.roleAccessManager
      .getResources(null, null, prefix)
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  findAll(cb) {
    this.scope.roleAccessManager
      .getResources()
      .then(result => cb(null, result))
      .catch(err => cb(err));
  }

  findById(id, cb) {
    this.scope.roleAccessManager
      .getResource(id)
      .then((result) => {
        cb(null, [result]);
      })
      .catch(err => cb(err));
  }

  insert (data, cb) {
    this.scope.roleAccessManager
      .defineResource(data.id, data.name)
      .then((result) => {
        cb(null, result);
      })
      .catch(err => cb(err));
  }

  update (id, data, cb) {
    this.scope.roleAccessManager
      .defineResource(data.id, data.name)
      .then((result) => {
        if (id === data.id) {
          return cb(null, result);
        }
        this.rename(id, data.id, (err) => {
          cb(err, result);
        });
      })
      .catch(err => cb(err));
  }

  remove (id, cb) {
    this.scope.roleAccessManager
      .undefineResources([id])
      .then(() => {
        cb(null, id);
      })
      .catch(err => cb(err));
  }

  removeList(ids, cb) {
    this.scope.roleAccessManager
      .undefineResources(ids)
      .then(() => {
        cb(null, ids);
      })
      .catch(err => cb(err));
  }

  rename (source, target, cb) {
    let role = new Role();
    async.waterfall([
      cb => role.findAll(cb),
      (docs, cb) => {
        async.eachSeries(docs, (doc, cb) => {
          Role.getResourceAccess(doc.id, (err, access) => {
            access[source] ? Role.setResourceAccess(doc.id, target, access[source], cb) : cb();
          });
        }, cb);
      },
      cb => Acl.removeResource(source, cb)
    ], cb);
  }

  static sync (cb) {
    cb();
  }
};

