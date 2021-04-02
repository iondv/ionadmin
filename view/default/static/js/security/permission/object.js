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
    "name": {
    },
    "description": {
    }
  };
  objectManager("security/permission", fields);
})(jQuery);
