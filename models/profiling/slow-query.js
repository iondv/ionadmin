'use strict';

const Base = require('../base');
const config = require('../../config');
const async = require('async');
const extend = require('extend');
const fs = require('fs');
const path = require('path');
const {t} = require('@iondv/i18n');

module.exports = class SlowQuery extends Base {

  static getConfig () {
    return config && config.profiling && config.profiling.slowQuery ? config.profiling.slowQuery : {};
  }

  constructor () {
    super('ion_profiling_slow_query');

    this.ATTRS = this.ATTRS.concat([
      {
        name: 'op'
      },
      {
        name: 'ns'
      },
      {
        name: 'query'
      },
      {
        name: 'reslen'
      },
      {
        name: 'duration'
      },
      {
        name: 'createdAt'
      }
    ]);
  }

  findLastDate (cb) {
    this.db.getCollection().find().sort({'createdAt': -1}).limit(1).toArray((err, docs)=> {
      err || !docs.length ? cb(err) : cb(null, docs[0].createdAt);
    });
  }

  importNew (cb) {
    this.findLastDate((err, lastDate) => {
      err ? cb(err) : this.makeImport(lastDate, cb);
    });
  }

  importAll (cb) {
    this.db.truncate(err => {
      err ? cb(err) : this.makeImport(null, cb);
    });
  }

  makeImport (lastDate, cb) {
    let config = this.constructor.getConfig();
    if (config.sources instanceof Array) {
      if (!config.sources.length) {
        return cb(t('Log source not specified'));
      }
    } else {
      config.sources = [{
        collection: "system.profile"
      }];
    }
    async.eachSeries(config.sources, (source, cb)=> {
      let method = null;
      if (source.file) {
        method = this.importFromFile;
      } else if (source.collection) {
        method = this.importFromCollection;
      } else {
        return cb(t('Unknown log source'));
      }
      method.call(this, source, lastDate, (err, data)=> {
        err || !data ? cb(err) : this.insert(data, cb);
      });
    }, cb);
  }

  importFromFile (source, lastDate, cb) {
    fs.readFile(source.file, (err, data)=> {
      if (err || !data) {
        return cb(err);
      }
      if (lastDate instanceof Date) {
        lastDate = lastDate.toISOString().substring(0, 19);
      }
      let result = [];
      let rows = data.toString().split(/\n/);
      for (let i = rows.length - 1; i >= 0; --i) {
        if (rows[i].indexOf(' COMMAND ') > 0) {
          let doc = this.parseFileRow(rows[i], lastDate);
          if (!doc) break;
          result.push(doc);
        }
      }
      cb(null, result.length ? result.reverse() : null);
    });
  }

  parseFileRow (row, lastDate) {
    let date = row.substring(0, 19);
    if (lastDate && lastDate >= date) {
      return false;
    }
    let op = new RegExp('command: ([a-zA-Z]+)').exec(row);
    let ns = new RegExp(' command ([a-zA-Z\.$-_]+)').exec(row);
    let query = new RegExp('(\{.+\})').exec(row);
    let reslen = new RegExp(' reslen:([0-9]+)').exec(row);
    let duration = new RegExp(' ([0-9]+)ms').exec(row);
    return {
      op: op && op[1],
      ns: ns && ns[1],
      query: query && query[1],
      reslen: reslen && reslen[1],
      duration: duration && duration[1],
      createdAt: new Date(date)
    };
  }

  importFromCollection (source, lastDate, cb) {
    let db  = new (this.db.constructor)(source.collection);
    let condition = {};
    if (lastDate instanceof Date) {
      condition.ts = {'$gt': lastDate};
    }
    db.find(condition, (err, docs) => {
      if (err) {
        return cb(err);
      }
      let result = [];
      for (let doc of docs) {
        result.push({
          op: doc.op,
          ns: doc.ns,
          query: doc.query && JSON.stringify(doc.query),
          reslen: doc.responseLength,
          duration: doc.millis,
          createdAt: doc.ts
        });
      }
      cb(null, result.length ? result : null);
    });
  }
};

