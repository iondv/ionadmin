(function ($) {

  var dt = {
    aoColumns: [
      {
        "mData": "id",
        "sTitle": "ID"
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
