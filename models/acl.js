'use strict';

const ionAdmin = require('../index');

module.exports = class Acl {

  /**
   * @returns {RoleAccessManager}
   */
  static getManager() {
    return ionAdmin.scope.roleAccessManager;
  }

  /**
   * @returns {AclProvider}
   */
  static getAcl() {
    return ionAdmin.scope.aclProvider;
  }

  static grant (id, resource, permissions) {
    return this.getManager().grant(id, resource, permissions);
  }

  static getRoles (user) {
    return this.getManager().getRoles(user);
  }

  static getRoleUsers (role, cb) {
    this.getManager().getSubjects(role).then(result => cb(null, result)).catch(err => cb(err));
  }

  static addUserRoles (user, roles, cb) {
    this.getManager().assignRoles([user], roles).then(() => cb()).catch(err => cb(err));
  }

  static removeUserRoles (user, roles, cb) {
    this.getManager().unassignRoles([user], roles).then(() => cb()).catch(err => cb(err));
  }

  static removeRole (role, cb) {
    this.getManager().undefineRoles([role]).then(() => cb()).catch(err => cb(err));
  }

  static removeResource (resource, cb) {
    this.getManager().undefineResources([resource]).then(() => cb()).catch(err => cb(err));
  }

  static whatResources (role, cb) {
    this.getManager().getResources([role]).then((resources) => {
      cb(null, resources);
    }).catch(err => cb(err));
  }

  static clearAllRolePemissions (role, cb) {
    this.whatResources(role, (err, access) => {
      err ? cb(err) : this.getManager().deny([role], access).then(() => cb()).catch(err => cb(err));
    });
  }
};
