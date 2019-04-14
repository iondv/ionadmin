'use strict';

const path = require('path');
const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');
const Permissions = require('core/Permissions');

exports.list = function (req, res) {
  ionAdmin.can(req, res, accessResources.backup.id, Permissions.READ).then(() => {
    let scope = ionAdmin.getScope();
    return scope.backupProvider.list((el) => {
      return {
        date: el.stat.birthtime.getTime(),
        name: path.basename(el.filename, '.zip'),
        size: el.stat.size,
        download: `/ionadmin/api/backup/db/download?file=${encodeURIComponent(el.filename)}`
      };
    }).then((list) => {
      res.json(list);
    }).catch((err) => {
      scope.sysLog.error(err);
      throw err;
    });
  }).catch((err) => {
    res.status(500).send(err.toString());
  });
};

exports.create = function (req, res) {
  ionAdmin.can(req, res, accessResources.backup.id, Permissions.WRITE).then(() => {
    let scope = ionAdmin.getScope();
    return scope.backupProvider.backup(ionAdmin.getUser(req).id(), req.body.name, {
      namespace: req.body.ns,
      skipData: req.body.skipData,
      skipFiles: req.body.skipFiles,
      exportAcl: req.body.exportAcl,
      version: req.body.metaVersion,
      fileDir: req.body.fileDir
    }).then((task) => {
      res.send(task);
    }).catch((err) => {
      scope.sysLog.error(err);
      throw err;
    });
  }).catch((err) => {
    res.status(500).send(err.toString());
  });
};

exports.status = function (req, res) {
  ionAdmin.can(req, res, accessResources.backup.id, Permissions.READ).then(() => {
    let scope = ionAdmin.getScope();
    return scope.backupProvider.get(req.query.name, ionAdmin.getUser(req).id())
      .then((result) => {
        if (result === false) {
          res.send(true);
        } else {
          res.send({
            date: result.stat.birthtime.getTime(),
            name: path.basename(result.filename, '.zip'),
            size: result.stat.size,
            download: `/ionadmin/api/backup/db/download?file=${encodeURIComponent(result.filename)}`
          });
        }
      }).catch((err) => {
        scope.sysLog.error(err);
        throw err;
      });
  }).catch((err) => {
    res.status(500).send(err.toString());
  });
};

exports.download = function (req, res, next) {
  ionAdmin.can(req, res, accessResources.backup.id, Permissions.READ).then(() => {
    let scope = ionAdmin.getScope();
    let file = req.query.file;
    if (typeof file !== 'string' || path.extname(file) !== '.zip') {
      return next();
    }
    return scope.backupProvider.get(path.basename(file, '.zip'))
      .then((result) => {
        res.attachment(result.path);
        res.sendFile(path.resolve(result.path), {}, (err) => {
          if (err) {
            return next(err);
          }
        });
      }).catch((err) => {
        scope.sysLog.error(err);
        throw err;
      });
  }).catch((err) => {
    ionAdmin.renderError(req, res, err);
  });
};

exports.delete = function (req, res) {
  ionAdmin.can(req, res, accessResources.backup.id, Permissions.DELETE).then(() => {
    let scope = ionAdmin.getScope();
    let names = req.body.names;
    if (!(names instanceof Array)) {
      throw new Error('Параметр должен быть массивом');
    }
    return scope.backupProvider.delete(names)
      .then(() => {
        res.send('Done');
      }).catch((err) => {
        scope.sysLog.error(err);
        throw err;
      });
  }).catch((err) => {
    res.status(500).send(err.toString());
  });
};