const moment = require('moment');
const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');

exports.list = (req, res) => ionAdmin.can(req, res, accessResources.accesslog.id)
  .then(() => ionAdmin.getScope().authLogger.getChanges({
    type: req.body.filter.type,
    since: moment(req.body.filter.since).toDate(),
    till: moment(req.body.filter.till).toDate(),
    id: req.body.filter.user,
    ip: req.body.filter.ip
  }, {}, parseInt(req.body.start) || 0, parseInt(req.body.length) || 20, true))
  .then(result => res.json({
    draw: parseInt(req.body.draw),
    data: result,
    recordsTotal: result.total,
    recordsFiltered: result.total
  }))
  .catch(err => ionAdmin.renderError(req, res, err));
