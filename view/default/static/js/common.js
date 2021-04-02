'use strict';

$(function () {
  //window.sidebarSplitter && sidebarSplitter.initMobile();
});

$(window).on("resize", function () {
  //$(document.body).find('table.dataTable').DataTable().draw(false);
  //$(document.body).find('table.dataTable').DataTable().columns.adjust();
});

// COMMON HELPER

window.commonHelper = {

  formatFileSize: function (size) {
    if (size > 1048576) return parseInt(size / 1048576) + ' Mb';
    if (size > 1024) return parseInt(size / 1024) + ' Kb';
    return size + ' b';
  }
};

// OBJECT HELPER

window.objectHelper = {

  indexArray: function (items, key) {
    var index = {};
    if (items instanceof Array) {
      for (var i = 0; i < items.length; ++i) {
        index[items[i][key]] = items[i];
      }
    } else if (items && typeof items === 'object') {
      index[items[key]] = items;
    }
    return index;
  },

  unsetKeys: function (object, keys) {
    for (var i = 0; i < keys.length; ++i) {
      delete object[keys[i]];
    }
  },

  removeByKeyValues: function (objects, key, values) {
    for (var i = objects.length - 1; i >= 0; --i) {
      if (values.indexOf(objects[i][key]) > -1) {
        objects.splice(i, 1);
      }
    }
  },

  replaceInArray: function (objects, target, key) {
    for (var i = 0; i < objects.length; ++i) {
      if (objects[i][key] == target[key]) {
        objects.splice(i, 1, target);
        break;
      }
    }
  },
  // get [ key: value, ... ] from object array
  mapArray: function (items, key, value) {
    var maps = [];
    if (items instanceof Array) {
      for (var i = 0; i < items.length; ++i) {
        var map = {};
        map[items[i][key]] = items[i][value];
        maps.push(map);
      }
    } else {
      throw new Error("mapArray");
    }
    return maps;
  }
};

// MESSAGE CALLOUT

window.messageCallout = (function () {

  var $callout = $("#message-callout");

  function show (type, message, title) {
    var $title = $callout.find('.message-callout-title');
    title ? $title.html(title).show() : $title.hide();
    $callout.removeClass('alert-info alert-success alert-warning alert-danger').addClass('alert-'+ type);
    var $content = $callout.find('.message-callout-content');
    message ? $content.html(message).show() : $content.hide();
    $callout.show();
  }
  return {
    info: function (message, title) {
      show("info", message, title);
    },
    success: function (message, title) {
      show("success", message, title);
    },
    warn: function (message, title) {
      show("warning", message, title);
    },
    error: function (message, title) {
      show("danger", message, title);
    },
    hide: function () {
      $callout.hide();
    }
  };
})();

// DATE PICKER

if ($.fn.datepicker) {
  $.extend($.fn.datepicker.defaults, {
    autoclose: true,
    format: 'dd.mm.yyyy',
    language: 'ru',
    todayHighlight: true
  });
}

if ($.fn.datetimepicker) {
  $.fn.datetimepicker.defaultOpts = {
    locale: 'ru',
    sideBySide: false,
    showClear: true,
    showClose: true,
    ignoreReadonly: true
  };
}

window.dateRangePickerDefaults = {
    startDate: moment().subtract(1, 'months'),
    locale: {
        "format": "DD.MM.YYYY",
        "separator": " - ",
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "from",
        "toLabel": "to",
        "customRangeLabel": "Custom",
        "daysOfWeek": ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
        "monthNames": ["January","February","March","April","May","June","July","August","September","October","November","December"],
        "firstDay": 1
    }
};

// DATA TABLES

if ($.fn.dataTable) {
  $.extend($.fn.dataTable.defaults, {
    "paging": true,
    "scrollX": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": false,
    "sDom": "<'row'<'col-sm-6'f><'col-sm-6'l>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
    "language": {
      "processing": "Wait...",
      "search": "Search:",
      "lengthMenu": "Show _MENU_ records",
      "info": "Records from _START_ to _END_ of _TOTAL_ records",
      "infoEmpty": "Records from 0 to 0 of 0 records",
      "infoFiltered": "(fetched of _MAX_ records)",
      "infoPostFix": "",
      "loadingRecords": "Records loading...",
      "zeroRecords": "No records.",
      "emptyTable": "Table has no data",
      "paginate": {
        "first": "<<",
        "previous": "<",
        "next": ">",
        "last": ">>"
      },
      "aria": {
        "sortAscending": ": activate for ascending sorting",
        "sortDescending": ": activate for descending sorting"
      }
    }
  });
}

if ($.fn.select2) {
  $.fn.select2.defaults.set('language', 'ru');
}

// SIDEBAR MENU

(function () {
})();

// IMODAL

(function () {
})();

// INPUTMASK ALIASES

if (window.Inputmask) {
  Inputmask.extendAliases({
    email: {
      definitions: {
        "*": {
          validator: "[\w!#$%&'*+/=?^_`{|}~-]",
          cardinality: 1,
          casing: "lower"
        },
        "-": {
          validator: "[\w-]",
          cardinality: 1,
          casing: "lower"
        }
      }
    }
  });
}
//

/*** REST API ***/
// get object               GET     api/model/news/123                                                response { object }
// create object            POST    api/model/news          post { attr1: val1, attr2: val2, ... }    response { object, errors }
// update object            PUT     api/model/news/123      post { attr1: val1, attr2: val2, ... }    response { object, errors }
// remove object            DELETE  api/model/news/123                                                ...

// get list objects         GET     api/model/news                                                    response [ { object }, ... ]
// delete list objects      DELETE  api/model/news          post [ id1, id2, id3, ... ]               ...

(function () {

  var urlPrefix = "ionadmin/api/";
  window.restApi = {
    get: function (model, data) {
      if (typeof data === "object") {
        return $.get(urlPrefix + model, data);
      } else {
        return $.get(urlPrefix + model + (data ? ("/" + data) : ""));
      }
    },
    create: function (model, data) {
      return $.post(urlPrefix + model, data);
    },
    update: function (model, id, data) {
      return $.ajax({
        url: urlPrefix + model + "/" + id,
        method: "put",
        //method: "post",
        data: data
      });
    },
    remove: function (model, id) {
      return $.ajax({
        url: urlPrefix + model + "/" + id,
        method: "delete"
        //method: "post"
      });
    },
    getList: function (model, data) {
      return $.get(urlPrefix + model, data);
    },
    removeList: function (model, data) {
      return $.ajax({
        url: urlPrefix +'delete-list/'+ model,
        //method: "delete", // not pass data by DELETE method
        method: "post",
        data: { ids: data }
      });
    }
  };
})();

/*** SIDEBAR MENU ***/

(function () {
  var code =  $(document.body).data("page");
  if (typeof code === 'string') {
    code = code.replace('/', '-');
  }
  var $item = $("#sidemenu-item-" + code);
  $item.each(function () {
    var $item = $(this).addClass("active-page");
    $item.closest(".sidebar-menu").find(".treeview.active").removeClass("active");
    $item.parents(".treeview").addClass("active");
  });
  if ($item.length === 0) {
    $('#sidebar-menu').find('a').each(function () {
      var $a = $(this);
      var pos = location.pathname.indexOf($(this).attr('href'));
      if (pos === 1 || pos === 0) {
        $a.parent().addClass("active-page").parents(".treeview").addClass("active");
      }
    });
  }
})();

