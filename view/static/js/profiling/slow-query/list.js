"use strict";

(function ($) {

  var dt = {
    aoColumns: [
      {
        "mData": "createdAt",
        "sTitle": "Created",
        "mRender": function (data, type, full) {
          return type === "display" ? (new Date(data)).toLocaleString() : data;
        }
      },
      {
        "mData": "duration",
        "sTitle": "Duration (ms)"
      },
      {
        "mData": "reslen",
        "sTitle": "Response size (bytes)"
      },
      {
        "mData": "op",
        "sTitle": "Operation"
      },
      {
        "mData": "ns",
        "sTitle": "Class"
      },
      {
        "mData": "query",
        "sTitle": "Request"
      }
    ],
    order: [[0, "desc"]]
  };

  listManager("profiling/slow-query", {
    dt: dt
  });

  var $importAll = $('#import-all');
  var $importNew = $('#import-slow-query');
  var $box = $importNew.closest('.box');
  var $loader = $box.find('.list-loader');

  $importAll.click(function () {
    if (confirm('Reload all logs?')) {
      importSlowQuery('ionadmin/api/profiling/slow-query/import-all');
    }
  });

  $importNew.click(function () {
    importSlowQuery('ionadmin/api/profiling/slow-query/import-new');
  });

  function importSlowQuery (url) {
    $loader.show();
    $.post(url).always(function () {
      $loader.hide();
    }).done(function (data) {
      $box.find('.reload-btn').click();
    }).fail(function (xhr, textStatus, err) {
      messageCallout.error(xhr.responseText || err);
    });
  }

  var $settings = $('#slow-settings');
  var $settingsForm = $('#slow-settings-form');
  var $save = $settingsForm.find('.save');
  var $level = $('#slow-settings-level');
  var $threshold = $('#slow-settings-threshold');

  $.get('ionadmin/api/profiling/slow-query/get-level').done(function (data) {
    if (data.was === undefined || data.slowms === undefined) {
      return;
    }
    $level.val(data.was);
    $threshold.val(data.slowms);

    $settings.click(function () {
      $settingsForm.modal();
    }).removeAttr('disabled');

    $save.click(function () {
      $save.attr('disabled', true);
      $.post('ionadmin/api/profiling/slow-query/set-level', {
        level: $level.val(),
        threshold: $threshold.val()
      }).done(function () {
      }).always(function () {
        location.reload();
      });
    });
  });

})(jQuery);
