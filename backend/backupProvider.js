'use strict';

const Background = require('@iondv/commons/lib/Background');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const archiver = require('archiver');
const worker = require('@iondv/utils/lib/export');
const {t} = require('@iondv/i18n');
const {format} = require('util');

/**
 * @param {{}} options
 * @param {Background} options.bg
 * @param {String} options.backupDir
 * @param {{}} options.zlib
 * @param {MetaRepository} options.metaRepo
 * @param {DataRepository} options.dataRepo
 * @param {WorkflowProvider} options.workflows
 * @param {SequenceProvider} options.sequences
 * @param {Logger} options.log
 * @param {AccountManager} options.accounts
 * @param {RoleAccessManager} options.accessManager
 * @param {Number} [options.maxOldMemory]
 * @param {Number} [options.step]
 */
module.exports = function (options) {

    this.init = function () {
      if (options.bg instanceof Background) {
        let po = [];
        if (options.maxOldMemory) {
          po.push('--max-old-space-size=' + options.maxOldMemory);
        }
        options.bg.register(
          'backupProvider',
          {
            path: path.join('modules', 'ionadmin'),
            node: po
          }
        );
      }
      return Promise.resolve();
    };

    /**
     * @param {String} uid
     * @param {String} name
     * @param {{}} opts
     * @param {Boolean} [opts.skipData]
     * @param {Boolean} [opts.skipFiles]
     * @param {String|Boolean} [opts.exportAcl]
     * @param {Boolean} [opts.lastVersion]
     * @param {Boolean} [opts.fileDir]
     * @param {String} [opts.namespace]
     * @param {String} [opts.version]
     * @returns {Promise}
     */
    this.backup = function (uid, name, opts) {
      let file = path.join(options.backupDir, `${name}.zip`);
      return new Promise((resolve, reject) => {
        if (options.bg instanceof Background) {
          mkdirp(options.backupDir, {},
            (err) => {
              if (err) {
                reject(err);
              }
              fs.stat(file, (err, stat) => {
                if (stat) {
                  reject(new Error(format(t('File %s already exists'), name)));
                }
                try {
                  resolve(options.bg.start(uid, 'backupProvider', name, opts));
                } catch (err2) {
                  reject(err2);
                }
              });
            });
        } else {
          resolve();
        }
      });
    };

  function spike(basePath, filePath, archiver) {
    return new Promise((resolve, reject) => {
      const fn = path.join(basePath, filePath);
      fs.stat(fn, (err, stats) => {
        if (err) {
          return reject(err);
        }
        if (stats.isDirectory()) {
          fs.readdir(fn, (err, files) => {
            if (err) {
              return reject(err);
            }
            let p = Promise.resolve();
            files.forEach((file) => {
              p = p.then(() => spike(basePath, path.join(filePath, file), archiver));
            });
            p.then(resolve).catch(reject);
            });
        } else {
          let rs = fs.createReadStream(fn);
          rs.on('error', reject);
          rs.on('end', resolve);
          archiver.append(rs, {name: filePath});
        }
        });
    });
    }

  function rmDir(dirPath) {
    return new Promise((resolve, reject) => {
      fs.stat(dirPath, (err, stats) => {
        if (err) {
          return reject(err);
        }
        if (stats.isDirectory()) {
          fs.readdir(dirPath, (err, files) => {
            if (err) {
              return reject(err);
            }
            let p = Promise.resolve();
            files.forEach((file) => {
              p = p.then(() => rmDir(path.join(dirPath, file)));
            });
            p.then(() => {
              fs.rmdir(dirPath, err => err ? reject(err) : resolve());
            });
            });
        } else {
          fs.unlink(dirPath, err => err ? reject(err) : resolve());
        }
        });
    });
    }

    this.run = function (params) {
      let sourceDir = path.join(options.backupDir, params.sid);
      let archPath = `${sourceDir}.zip`;
      return worker(
        sourceDir,
        {
          namespace: params.ns,
          skipData: params.skipData === 'true',
          skipFiles: params.skipFiles === 'true',
          exportAcl: params.exportAcl,
          version: params.metaVersion,
          fileDir: params.fileDir,
          metaRepo: options.metaRepo,
          dataRepo: options.dataRepo,
          workflows: options.workflows,
          sequences: options.sequences,
          accessManager: options.accessManager,
          accounts: options.accounts,
          log: options.log,
          step: options.step
        }
      )
        .then(
          () => new Promise((res, rej) => {
            let output = fs.createWriteStream(archPath);
            output.on('close', res);
            let arc = archiver('zip', {zlib: options.zlib || {level: 1}});
            arc.on('error', rej);
            arc.pipe(output);
            spike(sourceDir, '', arc).then(() => {
              arc.finalize();
            }).catch(rej);
          })
        )
        .then(() => rmDir(sourceDir))
        .then(() => archPath);
    };

    this.list = function (cb) {
      return new Promise((resolve, reject) => {
        fs.access(options.backupDir, (err) => {
          if (err) {
            return resolve([]);
          }
          fs.readdir(options.backupDir, (err, files) => {
            if (err) {
              return reject(err);
            }
            let p = Promise.resolve([]);
            files.forEach((f) => {
              if (path.extname(f) === '.zip') {
                p = p.then(resultFiles => new Promise(
                  (resolve, reject) => {
                    let filePath = path.join(options.backupDir, f);
                    fs.stat(filePath, (err, stat) => {
                      if (err) {
                        return reject(err);
                      }
                      if (stat.isFile()) {
                        let r = {
                          path: filePath,
                          filename: f,
                          stat: stat
                        };
                        if (typeof cb === 'function') {
                          resultFiles.push(cb(r));
                        } else {
                          resultFiles.push(r);
                        }
                      }
                      resolve(resultFiles);
                    });
                  })
                );
              }
            });
            p.then(resolve).catch(reject);
          });
        });
      });
    };

    /**
     * @param {String[]} names
     */
    this.delete = function (names) {
      let p = Promise.resolve();
      names.forEach((name) => {
        if (typeof name === 'string') {
          p = p.then(() => new Promise((resolve, reject) => {
            fs.unlink(path.join(options.backupDir, `${name}.zip`), err => err ? reject(err) : resolve());
          }));
        }
      });
      return p;
    };

    this.get = function (name, uid) {
      let p = Promise.resolve(path.join(options.backupDir, `${name}.zip`));
      if (uid && options.bg instanceof Background) {
        p = options.bg.status(uid, 'backupProvider', name)
          .then((s) => {
            if (s === Background.IDLE) {
              return options.bg.results(uid, 'backupProvider', name)
                .then(results => results[results.length - 1]);
            }
            return false;
          });
      }
      return p.then((archPath) => {
        if (archPath === false) {
          return false;
        }
        if (!archPath) {
          throw new Error(t('Backup process was unexpectedly ended.'));
        }
        return new Promise((resolve, reject) => {
          fs.stat(
            archPath,
            (err, stat) => err ? reject(err) : resolve(
              {
                path: archPath,
                filename: `${name}.zip`,
                stat: stat
              }
            )
          );
        });
      });
    };
};
