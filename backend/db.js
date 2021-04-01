'use strict';

const { di } = require('@iondv/core');
const moduleName = require('../module-name');
const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;

module.exports = class Db {

  constructor (table) {
    this.scope = di.context(moduleName);
    this.connection = this.scope.Db.db;
    this.table = table;
  }

  wrapId (id) {
    if (!id) {
      return id;
    }
    return id instanceof Array ? id.map(id => ObjectID(id)) : ObjectID(id);
  }

  getIdQuery (id) {
    id = this.wrapId(id);
    return {
      _id: id instanceof Array ? { $in: id } : id
    };
  }

  close () {
    // this.db.close();
  }

  isCollectionExists (table, cb) {
    this.connection.listCollections().get((err, items)=> {
      if (err) {
        return cb(err);
      }
      for (let item of items) {
        if (item.name === table) {
          return cb(null, true);
        }
      }
      return cb(null, false);
    });
  }

  getCollection () {
    if (!this._collection) {
      this._collection = this.connection.collection(this.table);
    }
    return this._collection;
  }

  count (condition, cb) {
    this.getCollection().count(condition, cb);
  }

  find (condition, cb, select) {
    this.getCollection().find(condition, select).toArray(cb);
  }

  insert (data, cb) {
    this.getCollection().insert(data, {}, cb);
  }

  update (condition, data, cb) {
    this.getCollection().update(condition, {$set: data}, {}, cb);
  }

  remove (condition, cb) {
    this.getCollection().remove(condition, cb);
  }

  drop (cb, table) {
    table = table || this.table;
    this.isCollectionExists(table, (err, exists)=> {
      if (err || !exists) {
        return cb(err);
      }
      this.connection.collection(table).drop(cb);
    });
  }
  
  truncate (cb) {
    this.drop(cb);
  }

  distinct (field, condition, options, cb) {
    this.getCollection().distinct(field, condition, options, cb);
  }
};