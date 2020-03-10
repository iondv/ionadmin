module.exports = (getScope) => {

  function getManager() {
    return getScope().roleAccessManager;
  }

  function getResourceAccess(id) {
    return getManager().getResources(id)
      .then(resources => getScope().aclProvider.getPermissions(id, resources.map(res => res.id), true))
      .then((access) => {
        const result = {};
        Object.keys(access).forEach((res) => {
          result[res] = Object.keys(access[res]);
        });
        return result;
      });
  }

  function findAll() {
    return getManager().getRoles();
  }

  function findOne (id) {
    return getManager().getRole(id).then((role) => {
      if (role) {
        return getResourceAccess(role.id).then((access) => {
          role.access = access;
          return role;
        });
      }
      return null;
    });
  }

  return {
    findAll,
    findOne,

    insert: (data, author) => getManager().defineRole(data.id, data.name, null, author)
      .then(() => {
        let p = Promise.resolve();
        const access = data.access ? JSON.parse(data.access) : {};
        Object.keys(access).forEach((resource) => {
          p = p.then(() => getManager().grant(data.id, resource, access[resource], author));
        });
        return p.then(() => data);
      }),

    update: (id, data, author) => findOne(id)
      .then((role) => {
        if (role) {
          return getManager().getResources([role.id])
            .then(resources => getManager().deny([role.id], resources.map(res => res.id), null, author));
        }
        return getManager().defineRole(data.id, data.name, null, author);
      })
      .then(() => {
        let p = Promise.resolve();
        if (id !== data.id)
          p = getManager().undefineRoles([id], author);
        const access = data.access ? JSON.parse(data.access) : {};
        Object.keys(access).forEach((resource) => {
          if (access[resource] instanceof Array && access[resource].length)
            p = p.then(() => getManager().grant(data.id, resource, access[resource], author));
        });
        return p.then(() => data);
      }),

    remove: (id, author) => getManager().undefineRoles([id], author),

    removeList: (ids, author) => getManager().undefineRoles(ids, author).then(() => ids),

    findAllWithUsers: () => findAll().then((roles) => {
      let p = Promise.resolve();
      roles.forEach((role) => {
        p = p.then(() => getManager().getSubjects(role))
          .then((users) => {
            role.users = users;
          });
      });
      return p.then(() => roles);
    }),

    getResourceAccess
  };
};
