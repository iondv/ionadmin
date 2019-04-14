/**
 * Created by krasilneg on 17.12.18.
 */
const ionAdmin = require('../index');

module.exports = class Base2 {

  static indexBy(key, items) {
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

  indexObjectsByKey(objects, key) {
    let index = {};
    objects.forEach((object) => {
      index[object[key]] = object;
    });
    return index;
  }

  constructor(options) {
    this.scope = ionAdmin.getScope();
    this.FORM_ATTR_PREFIX = 'obj-';
    this.options = Object.assign({}, options);
  }

  filterAttrs(data) {
    let result = {};
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (key.indexOf(this.FORM_ATTR_PREFIX) !== 0) {
          continue;
        }
        let name = key.substring(this.FORM_ATTR_PREFIX.length);
        result[name] = data[key];
      }
    }
    return result;
  }

  findOne(id, cb) {
    cb(null);
  }

  findAll(cb) {
    this.find({}, cb);
  }

  findById(id, cb) {
    cb([]);
  }

  insert(data, cb) {
    cb(null);
  }

  update(id, data, cb) {
    cb(null);
  }

  remove(id, cb) {
    cb();
  }

  removeList(ids, cb) {
    cb();
  }
}
