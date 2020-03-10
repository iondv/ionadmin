/**
 * @param {User} user 
 */
function cast(user) {
  return {
    id: user.id(),
    login: user.id().split('@')[0],
    name: user.name(),
    type: user.type(),
    email: user.email(),
    //pwd: u.pwdHash(),
    disabled: user.isDisabled()
  };
}

module.exports = (getScope) => {

  function getAccounts() {
    return getScope().accounts;
  }

  function getManager() {
    return getScope().roleAccessManager;
  }

  return {
    findAll: () => getAccounts().list(null, true).then(users => users.map(u => cast(u))),

    findOne: id => getAccounts().get(id, null, true)
      .then(user => cast(user))
      .then(user => getManager().getRoles(user.id)
        .then((roles) => {
          user.roles = roles;
          return user;
        })),

    insert: (data, author) => {
      const roles = data.roles ? data.roles.split(',') : [];
      delete data.roles;
      if (data.login) {
        data.id = data.login;
        delete data.login;
      }
      data.needPwdReset = true;
      return getAccounts().register(data)
        .then(u => cast(u))
        .then((inserted) => {
          let p = Promise.resolve();
          if (roles.length)
            p = getManager().assignRoles([inserted.id], roles, author);
          return p.then(() => inserted);
        });
    },

    // eslint-disable-next-line max-statements
    update: (id, data, author) => {
      const roles = data.roles ? data.roles.split(',') : [];
      delete data.roles;
      if (data.login) {
        data.id = data.login;
        delete data.login;
      }
      data.disabled = Boolean(data.disabled);
      data.needPwdReset = true;

      let p0 = Promise.resolve();
      if (data.pwd) {
        p0 = getAccounts().setPassword(id, null, data.pwd);
        delete data.pwd;
      }
      return p0.then(() => getAccounts().set(id, data))
        .then((result) => {
          const user = cast(result);
          let p = getManager().getRoles(id)
            .then(tmp => getManager().unassignRoles([id], tmp, author));
          if (roles.length) {
            p = p.then(() => getManager().assignRoles([user.id], roles, author))
              .then(() => {
                user.roles = roles;
              });
          }
          return p.then(() => user);
        });
    },

    remove: (id, author) => getManager().getRoles(id)
      .then(roles => getManager().unassignRoles([id], roles, author))
      .then(() => getAccounts().unregister(id)),

    removeList: (ids, author) => {
      let p = Promise.resolve();
      ids.forEach((id) => {
        p = p.then(() => getManager().getRoles(id))
          .then(roles => getManager().unassignRoles([id], roles, author))
          .then(() => getAccounts().unregister(id));
      });
      return p.then(() => ids);
    },

    findAllWithRoles: () => getManager().getRoles()
      .then((rolesArr) => {
        const roles = {};
        rolesArr.forEach((role) => {
          roles[role.id] = role;
        });
        return getAccounts().list(null, true)
          .then(users => users.map(user => cast(user)))
          .then((users) => {
            let p = Promise.resolve();
            users.forEach((user) => {
              p = p.then(() => getManager().getRoles(user.id))
                .then((roles2) => {
                  user.roles = roles2 ? roles2.map(rid => roles[rid]) : [];
                });
            });
            return p.then(() => users);
          });
      })
  };
};
