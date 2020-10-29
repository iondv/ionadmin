'use strict';

jQuery(function () {
  var $globalLoader = $('#global-loader');
  var $loader = $('#backup-loader');
  var $reload = $('#reload-backup');
  var $createModalBtn = $('#create-backup');
  var $deleteBtn = $('#delete-backup');
  var $downloadBtn = $('#download-backup');
  var $table = $('#backup-list');
  var $createModal = $('#backup-create-modal');
  var $filename = $('#backup-name');
  var $ns = $('#backup-namespace');
  var $skipData = $('#backup-skip-data');
  var $skipFiles = $('#backup-skip-files');
  var $exportAcl = $('#backup-export-acl');
  var $metaVersion = $('#backup-version');
  var $fileDir = $('#backup-filedir');

  var dataTable = $table.DataTable({
    sDom: "<'row'<'col-sm-6'f><'col-sm-6'l>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
    aoColumns: [
      {
        "mData": "date",
        "sTitle": "Creation date ",
        "mRender": function (data, type, full) {
          return type === "display" ? (new Date(data)).toLocaleString() : data;
        }
      },
      {
        "mData": "name",
        "sTitle": "Archive name"
      },
      {
        "mData": "size",
        "sTitle": "Archive size (Mb)",
        "mRender": function (data, type, full) {
          return (data / 1024 / 1024).toFixed(3);
        }
      },
      {
        "mData": "download",
        "sTitle": "File",
        "mRender": function (data, type, full) {
          return type === "display" ? '<a href="' + data + '" target="_blank">Download</a>' : data;
        }
      }
    ],
    order: [[0, "desc"]]
  });

  $reload.click(function () {
    messageCallout.hide();
    $loader.show();
    $.get('ionadmin/api/backup/db/list').done(function (objects) {
      dataTable.clear().rows.add(objects).draw();
    }).fail(function (xhr) {
      messageCallout.error('Error on loading archive list.');
    }).always(function () {
      $loader.hide();
    });
  }).click();

  $table.on("click", "tbody tr", function (event) {
    if (!event.ctrlKey) {
      $table.find("tr.selected").not(this).removeClass('selected');
    }
    $(this).toggleClass('selected');
  });

  function getSelectedNames () {
    var result = [];
    var rows = dataTable.rows('.selected').data();
    for (var i = 0; i < rows.length; ++i) {
      result.push(rows[i].name);
    }
    return result;
  }

  // CREATE

  $createModalBtn.click(function () {
    messageCallout.hide();
    $createModal.modal('show');
    $ns.change();
  });

  $ns.change(function () {
    var ns = $ns.val() ? $ns.val()+'-' : '';
    $filename.val(ns +'backup-'+ (new Date).getTime());
  });

  function check (name, cb) {
    setTimeout(function () {
      $.get('ionadmin/api/backup/db/status', {
        name: name
      }).done(function (result) {
        if (result === true) {
          check(name, cb);
        } else {
          messageCallout.hide();
          cb();
          if (result.err) {
            messageCallout.error(result.err || 'Backup failed due to error.');
          } else if (result.name || result.download) {
            dataTable.rows.add([result]).draw();
          }
        }
      }).fail(function (xhr) {
        messageCallout.error(xhr.responseText);
        cb();
      });
    }, 30 * 1000);
  }

  $createModal.find('.create').click(function () {
    var name = $.trim($filename.val());
    var ns = $.trim($ns.val());
    var acl = $.trim($exportAcl.val());
    if (name && ns) {
      $createModalBtn.width($createModalBtn.width());
      $createModalBtn.find('.sozdat').hide();
      $createModalBtn.find('.loader').show();
      $createModalBtn.prop('disabled', true);
      $.post('ionadmin/api/backup/db/create', {
        name: name,
        ns: ns,
        skipData: $skipData.is(':checked'),
        skipFiles: $skipFiles.is(':checked'),
        exportAcl: acl,
        metaVersion: $metaVersion.val(),
        fileDir: $fileDir.val()
      }).done(function (name) {
        check(name, function () {
          $createModalBtn.find('.sozdat').show();
          $createModalBtn.find('.loader').hide();
          $createModalBtn.prop('disabled', false);
        });
      }).fail(function (xhr) {
        messageCallout.error(xhr.responseText || 'Backup failed due to error');
      }).always(function () {
        $globalLoader.hide();
        $createModal.modal('hide');
      });
    }
  });

  // DELETE

  $deleteBtn.click(function () {
    messageCallout.hide();
    var names = getSelectedNames();
    if (names.length === 0) {
      return messageCallout.warn('Select archive for deletion');
    }
    if (confirm('Delete selected archives?')) {
      $loader.show();
      $.post('ionadmin/api/backup/db/delete', {
        names: names
      }).done(function () {
        $reload.click();
      }).fail(function (xhr) {
        $loader.hide();
        messageCallout.error(xhr.responseText || 'Deletion error');
      });
    }
  });

  // DOWNLOAD

  $downloadBtn.click(function () {
    messageCallout.hide();
    var names = getSelectedNames();
    if (names.length !== 1) {
      return messageCallout.warn('Select archive for downloading');
    }
  });

});
