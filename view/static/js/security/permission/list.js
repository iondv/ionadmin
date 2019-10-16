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
        "mData": "description",
        "sTitle": "Description"
      }
    ],
    order: [[1, "asc"]]
  };

  listManager("security/permission", {
    dt: dt
  });

})(jQuery);
