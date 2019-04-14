const ionAdmin = require('../../../index');
const access = require('../../../access-resources').recache;
const respond = require('../../../backend/respond');
const onError = require('../../../backend/error');
const recache = require('lib/util/recache');

module.exports = function (req, res) {
  ionAdmin.can(req, res, access.id)
    .then(() => respond(res, (scope) => {

      function logger(message, event) {
        if (!event) {
          res.write('data: ' + message + '\n\n');
        } else {
          res.write('event: ' + event + '\ndata: ' + message + '\n\n');
        }
      }

      let classes = req.query.classes;
      let recacheOptions = {
        skipDependencies: req.query.skipcd === 'true'
      };

      try {
        classes = new Buffer(classes, 'base64').toString('ascii');
        classes = JSON.parse(classes);
      } catch (e) {
        classes = null;
      }

      if (classes) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        recache(classes, recacheOptions, scope.metaRepo, scope.dataRepo, logger)
          .then(() => res.end())
          .catch((err) => {
            logger('Ошибка импорта!', 'err');
            onError(scope, err, null, true);
          });
      } else {
        onError(scope, null, null, 'wrong request');
      }

    }), ['dataRepo'])
    .catch(err => ionAdmin.renderError(req, res, err));

};
