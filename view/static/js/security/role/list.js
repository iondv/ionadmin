(function ($) {

  var dt = {
    aoColumns: [
      {
        "mData": "id",
        "sTitle": "Identifier"
      },
      {
        "mData": "name",
        "sTitle": "Name"
      },
      {
        "mData": "users",
        "sTitle": "Users",
        "mRender": dataTableFormatter["list"]
      }
    ],
    order: [[0, "asc"]]
  };

  listManager("security/role", {
    dt: dt
  });

})(jQuery);
