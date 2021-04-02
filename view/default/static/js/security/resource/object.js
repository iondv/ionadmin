(function ($) {

  var fields = {
    "_id": {},
    "id": {
      validators: [
        {
          type: 'required'
        }
      ]
    },
    "name": {}
  };
  objectManager("security/resource", fields);
})(jQuery);
