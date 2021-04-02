(function ($) {

  var dt = {
    aoColumns: [
      {
        "mData": "type",
        "sTitle": "Type"
      },
      {
        "mData": "login",
        "sTitle": "Login"
      },
      {
        "mData": "name",
        "sTitle": "Name"
      },
      {
        "mData": "roles",
        "sTitle": "Assigned roles",
        "mRender": dataTableFormatter["userRoles"]
      }
    ],
    order: [[1, "asc"]]
  };

  listManager("security/user", {
    dt: dt
  });

})(jQuery);
