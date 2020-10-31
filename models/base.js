'use strict';
const {t} = require('core/i18n');
const {format} = require('util');

module.exports = class Base {

  static indexBy (key, items) {
    let map = {};
    if (items instanceof Array) {
      for (let item of items) {
        if (item.hasOwnProperty(key)) {
          map[item[key]] = item;
        }
      }
    }
    return map;
  }

  constructor (table, options) {
    this.db  = new Db(table);
    this.TABLE = table;
    this.ATTRS = [];
    this.PK = '_id';
    this.FORM_ATTR_PREFIX = 'obj-';
    this.options = Object.assign({}, options);
  }

  // ATTRS

  getAttr (name) {
    for (let attr of this.ATTRS) {
      if (attr.name == name) {
        return attr;
      }
    }
    return null;
  }

  filterAttrs (data) {
    let result = {};
    for (let key in data) {
      if (key.indexOf(this.FORM_ATTR_PREFIX) !== 0) {
        continue;
      }
      let name = key.substring(this.FORM_ATTR_PREFIX.length);
      let attr = this.getAttr(name);
      if (attr) {
        if (attr.type === 'boolean') {
          result[name] = data[key] ? true : false;
        } else {
          result[name] = this.formatAttrValue(attr, data[key]);
        }
      }
    }
    this.setDefaultAttrs(result);
    return result;
  }

  setDefaultAttrs (data) {
    for (let attr of this.ATTRS) {
      if (data[attr.name] !== undefined) {
        continue;
      }
      if (attr.type == 'boolean') {
        data[attr.name] = false;
      }
    }
  }

  // VALIDATE

  validate (id, data, cb) {
    cb();
  }

  validateRequire (attrName, data, cb, msg) {
    if (data[attrName] === undefined || data[attrName] === null || data[attrName] === '') {
      cb(msg ?  msg : format(t('Field <b>%s</b> is required'), attrName));
    } else {
      cb();
    }
  }

  validateUnique (attrName, id, data, cb, msg) {
    let query = {[attrName]: data[attrName]};
    this.find(query, (err, docs)=> {
      if (err) {
        cb(err);
      } else if (docs.length > 0) {
        cb(docs[0]._id.toString() != id ? (msg ?  msg : format(t('Field <b>%s</b> value is already in use.'), attrName)) : null);
      } else {
        cb();
      }
    });
  }

  // FORMAT

  formatAttrValue (attr, value) {
    if (!attr.type) {
      return value;
    }
    switch (attr.type) {
      case 'boolean': return this.formatBoolean(value);
      case 'json': return this.formatJson(value);
    }
    return value;
  };

  formatBoolean (value) {
    return value ? true : false;
  }

  formatJson (value) {
    try {
      return JSON.parse(value);
    } catch (err) {
      console.error('model/base: formatJson:', err);
      return value;
    }
  }

  // CRUD

  find (query, cb) {
    this.db.find(query, cb);
  }

  findOne (id, cb) {
    this.find(this.db.getIdQuery(id), (err, docs)=> {
      if (err) cb(err);
      else {
        this.attrs = docs[0] ? docs[0] : null;
        cb(null, this.attrs);
      }
    });
  }

  findAll (cb) {
    this.find({}, cb);
  }

  findById (id, cb) {
    this.find(this.db.getIdQuery(id), cb);
  }

  insert (data, cb) {
    this.validate(null, data, err => {
      err ? cb(err) : this.db.insert(data, cb);
    });
  }

  update (id, data, cb) {
    this.validate(id, data, err => {
      err ? cb(err) : this.db.update(this.db.getIdQuery(id), data, cb);
    });
  }

  remove (id, cb) {
    this.db.remove(this.db.getIdQuery(id), cb);
  }

  removeList (ids, cb) {
    ids = ids instanceof Array ? ids : [ids];
    async.eachSeries(ids, (id, cb)=> {
      this.remove(id, cb);
    }, cb);
  }

  // HELPER

  indexObjectsByKey (objects, key) {
    let index = {};
    objects.forEach((object) => {
      index[object[key]] = object;
    });
    return index;
  }
};

const async = require('async');
const Db = require('../backend/db');
const ionAdmin = require('../index');