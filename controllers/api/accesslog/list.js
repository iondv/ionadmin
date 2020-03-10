const moment = require('moment');
const ionAdmin = require('../../../index');
const accessResources = require('../../../access-resources');

exports.list = (req, res) => ionAdmin.can(req, res, accessResources.accesslog.id)
  .then(() => ionAdmin.getScope().accessLogger.getChanges({
    type: req.body.filter.type,
    since: moment(req.body.filter.since).toDate(),
    till: moment(req.body.filter.till).toDate(),
    author: req.body.filter.author,
    ip: req.body.filter.ip,
    subject: req.body.filter.subject
  }, {}, parseInt(req.body.start) || 0, parseInt(req.body.length) || 20, true))
  .then(result => res.json({
    draw: parseInt(req.body.draw),
    data: result,
    recordsTotal: result.total,
    recordsFiltered: result.total
  }))
  .catch(err => ionAdmin.renderError(req, res, err));
