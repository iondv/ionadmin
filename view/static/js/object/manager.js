"use strict";

function objectManager (model, fields, options) {

  var OBJECT_ID = 'id'; // name of object id in database
  var listPostfix = "-list";
  var listPrefix = "#table-";

  var $form = $("#object-form");
  var $save = $("#save-form");
  var $close = $("#close-form");
  var $remove = $("#delete-object");
  var $loader = $("#object-loader");
  var $errorCallout = $("#object-error-callout");

  var currentObjectId;

  /*** LOAD ***/

  var uriId = getUriId();
  if (uriId) {
    restApi.get(model, uriId)
        .done(function (data) {
          init(data);
        })
        .fail(function (xhr, textStatus, errorThrown) {
          messageCallout.error(xhr.responseText ? xhr.responseText : errorThrown ? errorThrown : textStatus);
        });
  } else {
    init();
  }

  function getUriId() {
    var regex = new RegExp("ionadmin/.+/([^\\/]+)", 'i');
    var url = window.location.href;
    var id = regex.test(url) ? regex.exec(url)[1] : null;
    if (id === "create") {
      id = null;
    }
    return id;
  }

  function isOpenerListener() {
    return typeof window.refreshOpenerList === "function";
  }

  function getField(attr) {
    return $("#obj-" + attr);
  }

  function toggleFieldOverlay($field, state) {
    $field.closest(".form-control-box").find(".overlay").toggle(state);
  }

  function fireEvent(event, data) {
    $(document).trigger(event, data);
  }

  /*** INIT ***/

  function init(object) {
    if (typeof nestedManager === 'object') {
      nestedManager.init(object, setObjectChanged);
    }
    if (object) {
      currentObjectId = object[OBJECT_ID];
    }
    initFields(object);
    setValues(object);

    $loader.toggle(false);

    if ($.fn.wysihtml5) {
      $form.find(".wysihtml5").wysihtml5({
        events: {
          change: setObjectChanged
        }
      });
    }
  }

  function initFields(object) {
    for (var attr in fields) {
      var field = fields[attr];
      if (!field.format) continue;
      switch (field.format.type) {
        case "datepicker": initDatepicker(field, attr); break;
        case "dtObject": initDtObject(field, attr); break;
        case "dtObjectList": initDtObjectList(field, attr); break;
        case "dropdownObject": initDropdownObject(field, attr, object); break;
        case "checkboxList": initCheckboxList(field, attr, object); break;
        case "checkboxAccess": initCheckboxAccess(field, attr, object); break;
        case "resourceAccess": initResourceAccess(field, attr, object); break;
      }
    }
  }

  function initDatepicker(field, attr) {
    if (field.format.options.startDate) {
      field.format.options.startDate = window.getDateFromServerDate(field.format.options.startDate);
    }
    if (field.format.options.endDate) {
      field.format.options.endDate = window.getDateFromServerDate(field.format.options.endDate);
    }
    getField(attr).parent().find('.form-datepicker').change(function () {
      getField(attr).val(window.getServerDateFromDate($(this).datepicker("getDate")));
    }).datepicker(field.format.options);
  }

  function initDtObjectList(field, attr)  {
    var $table = $(listPrefix + attr);
    field.listManager = objectListManager(attr, field.model, $table, {
      $field: getField(attr),
      dt: $.extend({
        "lengthChange": false,
        "searching": false,
        "info": false
      }, field.format.options),
      objects: []
    });
  }

  function initDtObject(field, attr) {
    var $table = $(listPrefix + attr);
    field.listManager = objectListManager(attr, field.model, $table, {
      $field: getField(attr),
      maxObjects: 1,
      dt: $.extend({
        "paging": false,
        "lengthChange": false,
        "searching": false,
        "ordering": false,
        "info": false,
      }, field.format.options),
      objects: []
    });
  }

  function initDropdownObject(field, attr, object) {
    var options = field.format.options;
    var $field = getField(attr);
    // load object list by model
    restApi.getList(options.model).done(function (data) {
      if (data instanceof Array) {
        var result = '<option value=""></option>';
        for (var i = 0; i < data.length; ++i) {
          result += '<option value="' + data[i][options.value] + '">' + data[i][options.label] + '</option>';
        }
        $field.append(result);
        if (object && object[attr]) {
          formatValue($field, object[attr][options.value], attr);
        }
      }
    }).fail(function () {
      $field.attr("disabled", true);
      setFiedlError($field, "Error of list loading");
    }).complete(function () {
      toggleFieldOverlay($field, false);
    });
  }

  function initCheckboxList(field, attr, object) {
    var $field = getField(attr);
    var $list = $field.parent().find('.checkbox-list');
    $list.on('change', 'input', function () {
      var values = [];
      $list.find('input:checked').each(function () {
        values.push(this.value);
      });
      $field.val(values.join(',')).change();
    });
    var opts = field.format.options;
    $list.empty();
    $.get(opts.url).done(function (data) {
      if (!opts.value) opts.value = '_id';
      if (!opts.label) opts.label = opts.value;
      if (data instanceof Array) {
        if (opts.filter instanceof Function) {
          data = data.filter(opts.filter);
        }
        data.sort(function(a,b) {
          return a[opts.label] > b[opts.label] ? 1 : a[opts.label] < b[opts.label] ? -1 : 0;
        });
        for (var i = 0; i < data.length; ++i) {
          var item = data[i];
          var label = item[opts.label]
            ? (item[opts.label] +' <span class="small text-primary">('+ item[opts.value] +')</span>')
            : item[opts.value];
          var result = '<div class="checkbox-item"><label title="'+ item[opts.value]
            +'"><input type="checkbox" value="'+ item[opts.value] +'">'+ label +'</label></div>';
          $list.append(result);
        }
      }
      formatCheckboxList($field, $field.val().split(','));
    }).always(function () {
      toggleFieldOverlay($field, false);
    });
  }

  function initResourceAccess(field, attr, object) {
    resourceAccess(field, getField(attr));
  }

  /*** FORMAT ***/

  function setValues(object) {
    if (!object) return;
    for (var attr in fields) {
      formatValue(getField(attr), object[attr], attr, object);
    }
  }

  function formatValue($field, value, attr, full) {
    if (fields[attr].format) {
      var format = fields[attr].format;
      switch (format.type) {
        case "checkbox": formatCheckbox($field, value); break;
        case "checkboxList": formatCheckboxList($field, value, attr); break;
        case "datepicker": formatDatepicker($field, value, attr); break;
        case "image": formatImage($field, value, attr); break;
        case "property": formatProperty($field, value, attr); break;
        case "dtObject": formatDtObject($field, value, attr); break;
        case "dtObjectList": formatDtObjectList($field, value, attr); break;
        case "handler": format.format($field, value, attr, full); break;
        case "resourceAccess": formatResourceAccess($field, value, attr); break;
        default: $field.val(value);
      }
    } else {
      $field.val(value);
    }
  }

  function formatCheckbox($field, value) {
    $field.prop('checked', (value && value != 'false'));
  }

  function formatDatepicker($field, value, attr) {
    $field.val(value);
    $field.parent().find('.form-datepicker')
        .each(offChangeTracking)
        .datepicker("update", window.getDateFromServerDate(value))
        .each(onChangeTracking);
  }

  function formatImage($field, value, attr) {
    $field.val(value);
    $("#image-" + attr).attr('src', '/download/' + value);
  }

  function formatProperty($field, value, attr) {
    $field.val(value[fields[attr].format.name]);
  }

  function formatDtObject($field, value, attr) {
    fields[attr].listManager.reload(value);
  }

  function formatDtObjectList($field, value, attr) {
    fields[attr].listManager.reload(value);
  }

  function formatCheckboxList($field, value, attr) {
    var $list = $field.parent().find('.checkbox-list');
    if (value instanceof Array) {
      for (var i = 0; i < value.length; ++i)
        $list.find('[value="'+ value[i] +'"]').prop('checked', true);
    }
    $field.val(value ? value.join(',') : '');
  }

  function formatResourceAccess($field, value, attr) {
    resourceAccess.formatCheckboxAccess(value);
  }

  /*** TOOLS ***/

  $save.click(function () {
    if (!validate()) return;
    $loader.toggle(true);
    messageCallout.hide();

    var out = $form.serialize();
    var ajax = currentObjectId
        ? restApi.update(model, currentObjectId, out)
        : restApi.create(model, out);

    ajax.done(function (data) {
      data = data || {};
      if (data.insertedIds instanceof Array) {
        data[OBJECT_ID] = data.insertedIds[0];
      }
      if (data.errors && data.errors.length) {
        parseServerErrors(data.errors);
      } else if (data[OBJECT_ID]) {
        fireEvent(currentObjectId ? objectManager.EVENTS.updated : objectManager.EVENTS.created, data);
        currentObjectId = data[OBJECT_ID];
        objectChanged = false;
        messageCallout.info("Object saved");
        if ($close.is(":visible")) {
          $close.click();
        }
      } else {
        messageCallout.error("Object saving error");
        console.log("Data error", data);
      }
      fireEvent('object:saved', data);
    })
    .fail(function (xhr, textStatus, errorThrown) {
      messageCallout.error(xhr.responseText ? xhr.responseText : errorThrown ? errorThrown : textStatus);
    })
    .always(function () {
      $loader.toggle(false);
    });
  });

  $close.toggle(isOpenerListener());
  $close.click(function () {
    if (isOpenerListener()) {
      if (currentObjectId) {
        refreshOpenerList(currentObjectId);
      }
      window.close();
    }
  });

  $remove.click(function () {
    if (!currentObjectId || !confirm("Delete object?")) return;
    $loader.toggle(true);
    restApi.remove(model, currentObjectId)
        .done(function (data) {
          if (isOpenerListener()) {
            $close.click();
          } else {
            location.href = model + listPostfix;
          }
        })
        .fail(function (xhr, textStatus, errorThrown) {
          messageCallout.error(xhr.responseText || (errorThrown ? errorThrown : textStatus));
          $loader.toggle(false);
        });
  });

  /*** TRACK CHANGES ***/

  var objectChanged = false;

  function setObjectChanged () {
    objectChanged = true;
  }

  function onChangeTracking () {
    $(this).on("change", setObjectChanged);
  }

  function offChangeTracking () {
    $(this).off("change", setObjectChanged);
  }

  $form.find("select, input, textarea").each(onChangeTracking);

  $(window).on("beforeunload", function () {
    if (!objectChanged) return;
    return 'Object not saved. Changes will be lost.';
  });

  /*** ERRORS ***/

  function resetErrors() {
    $form.find(".form-group").removeClass("has-error");
    $errorCallout.hide();
  }

  function parseServerErrors(errors) {
    var commonErrors = "";
    for (var i = 0; i < errors.length; ++i) {
      var error = errors[i];
      var attr = error.attr;
      var message = error.message;
      if (fields[attr]) {
        setFieldError(getField(attr), message);
      } else {
        commonErrors += "<p><small>" + attr + "</small>: " + message + "</p>";
      }
    }
    if (commonErrors.length) {
      $errorCallout.html(commonErrors).show();
    } else {
      jumpToFirstError();
    }
  }

  function setFieldError($field, error) {
    var $group = $field.closest(".form-group");
    $group.addClass("has-error").find(".error-block").html(error);
  }

  function jumpToFirstError() {
    var $error = $form.find(".form-group.has-error");
    if ($error.length) {
      window.scrollToTarget($error.offset().top);
    }
  }

  /*** VALIDATE ***/

  function validate() {
    resetErrors();
    var valid = true;
    for (var attr in fields) {
      var $field = getField(attr);
      filterField($field, attr);
      var error = getFieldError($field, attr);
      if (error) {
        setFieldError($field, error);
        valid = false;
      }
    }
    jumpToFirstError();
    return valid;
  }

  function getFieldError($field, attr) {
    var error = null;
    var validators = fields[attr].validators;
    for (var i = 0; validators && i < validators.length; ++i) {
      switch (validators[i].type) {
        case "email":
          error = validateEmail($field, validators[i]);
          break;
        case "date":
          error = validateDate($field, validators[i]);
          break;
        case 'match':
          error = validateMatch($field, validators[i]);
          break;
        case "number":
          error = validateNumber($field, validators[i]);
          break;
        case "required":
          error = validateRequired($field, validators[i]);
          break;
        case "string":
          error = validateString($field, validators[i]);
          break;
        case "json":
          error = validateJson($field, validators[i]);
          break;
        case "handler":
          error = validators[i].validate($field, validators[i]);
          break;
      }
      if (error) break;
    }
    return error;
  }

  function getValidateMessage(data, msg) {
    return (data && data.message) ? data.message : msg;
  }

  function validateRequired($field, data) {
    return ($field.length && $field.val().length === 0) ? getValidateMessage(data, "Field is required") : null;
  }

  function validateEmail($field, data) {
    var value = $field.val();
    if (value.length === 0) return null; // pass empty value
    var reg = /^[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    return reg.test(value) ? null : getValidateMessage(data, "Field value is not an email");
  }

  function validateDate($field, data) {
    var value = $field.val();
    if (value.length === 0) return null; // pass empty value
    return $.isNumeric(value) ? null : getValidateMessage(data, "Field value is not a number");
  }

  function validateMatch($field, data) {
    var value = $field.val();
    return data.regex.test(value) ? null : getValidateMessage(data, "Wrong field value");
  }

  function validateNumber($field, data) {
    var value = $field.val();
    if (value.length === 0) return null; // pass empty value
    return $.isNumeric(value) ? null : getValidateMessage(data, "Field value is not a number");
  }

  function validateString($field, data) {
    var length = $field.val().length;
    if (length === 0) return null; // pass empty value
    if (data.min && data.min > length) return "Min string length is " + data.min + " symbols.";
    if (data.max && data.max < length) return "Max string length is - " + data.max + " symbols.";
    return null;
  }

  function validateJson($field, data) {
    try {
      var d = JSON.parse($field.val());
    } catch (err) {
      return "Invalid JSON";
    }
    return null;
  }

  /*** FILTER ***/

  function filterField($field, attr) {
    var filters = fields[attr].filters;
    filterTrim($field, attr); // default
    for (var i = 0; filters && i < filters.length; ++i) {
      switch (filters[i].type) {
        case 'trim':
          filterTrim($field, attr);
          break;
        case 'handler':
          filters[i].filter($field, attr);
          break;
      }
    }
  }

  function filterTrim($field, attr) {
    $field.val($.trim($field.val()));
  }
}

/*** EVENTS ***/

objectManager.EVENTS = {
  created: 'object:created',
  updated: 'object:updated'
};

objectManager.on = function(events, handler) {
  $(document).on(events, handler);
};

/*** WYSIHTML5 EDITOR ***/
// https://github.com/bootstrap-wysiwyg/bootstrap3-wysiwyg

if ($.fn.wysihtml5) {
  $.fn.wysihtml5.defaultOptions = {
    locale: "ru-RU",
    toolbar: {
      "font-styles": true, // Font styling, e.g. h1, h2, etc.
      "emphasis": true, // Italics, bold, etc.
      "lists": true, // (Un)ordered lists, e.g. Bullets, Numbers.
      "html": true, // Button which allows you to edit the generated HTML.
      "link": true, // Button to insert a link.
      "image": false, // Button to insert an image.
      "color": false, // Button to change color of font
      "blockquote": false, // Blockquote
      "size": "sm" // options are xs, sm, lg
    }
  };
}