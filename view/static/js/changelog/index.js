'use strict';

(function () {

  moment.locale('ru');

  var today = new Date();
  var defaultTill = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var defaultSince = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  var since = defaultSince;
  var till = defaultTill;

  var $tools = $('.list-tools');
  var $box = $tools.closest('.box');
  var $table = $box.find('.table');
  var $view = $('#changelog-view');
  var $filter = $tools.find('.filter');
  var filters = {
    $period: $tools.find('.period-filter'),
    $user: $tools.find('.user-filter'),
    $type: $tools.find('.type-filter'),
    $class: $tools.find('.class-filter'),
    $id: $tools.find('.id-filter')
  };

  filters.$period.daterangepicker({
    startDate: moment(defaultSince),
    endDate: moment(defaultTill),
    linkedCalendars: false,
    autoUpdateInput: true,
  }, function(start, end) {
    since = start;
    till = end;
  });

  filters.$user.add(filters.$class).select2({
    width: '100%'
  });

  $tools.find('.reset-filter').click(function () {
    filters.$period.data('daterangepicker').setStartDate(defaultSince);
    filters.$period.data('daterangepicker').setEndDate(defaultTill);
    filters.$user.val('').change();
    filters.$type.val('');
    filters.$class.val('').change();
    filters.$id.val('');
    $filter.click();
  });

  $filter.click(function () {
    dt.draw();
  });

  var dt = $table.DataTable({
    sDom: "t<'row'<'col-sm-6'i><'col-sm-6'p>>",
    serverSide: true,
    processing: false,
    order: [],
    pageLength: 20,
    ajax: {
      url: 'ionadmin/api/changelog/list',
      type: 'POST',
      data: function (data) {
        var s = moment(since);
        var t = new Date(till);
        t.setDate(t.getDate() + 1);
        t = moment(t);
        data.filter = {
          since: s.toISOString(),
          till: t.toISOString(),
          author: filters.$user.val(),
          type: filters.$type.val(),
          class: filters.$class.val(),
          id: filters.$id.val()
        };
      }
    },
    aoColumns: [{
      mData: "time",
      sTitle: "Date",
      mRender: function (data, type, full) {
        return type === "display" ? (new Date(data)).toLocaleString() : data;
      },
      orderable: false
    },{
      mData: "author",
      sTitle: "User",
      orderable: false,
      mRender: function (data, type, full) {
        return type === "display" ? formatUser(data) : data;
      }
    },{
      mData: "type",
      sTitle: "Action",
      orderable: false,
      mRender: function (data, type, full) {
        return type === "display" ? formatType(data) : data;
      }
    },{
      mData: "className",
      sTitle: "Class",
      orderable: false
    },{
      mData: "id",
      sTitle: "Object",
      orderable: false
    }],
    rowCallback: function (row, data, index) {
      if (data.type) {
        $(row).addClass(data.type.toLowerCase());
      }
    }
  });

  $table.on('click', 'tr', function (event) {
    $table.find('tr.selected').removeClass('selected');
    $(this).toggleClass('selected');
  });

  $table.on('dblclick', 'tr', function () {
    $table.find('tr.selected').removeClass('selected');
    $(this).addClass('selected');
    viewItem(dt.rows(this).data()[0]);
  });

  function viewItem (data) {
    $view.find('.timestamp-value').html((new Date(data.timestamp)).toLocaleString());
    $view.find('.user-value').html(formatUser(data.author));
    $view.find('.type-value').html(formatType(data.type));
    $view.find('.class-value').html(data.className);
    $view.find('.version-value').html(data.classVersion);
    $view.find('.id-value').html(data.id);
    $view.find('.base-value').html('<pre>'+ JSON.stringify(data.base, null, 2) +'</pre>');
    $view.find('.data-value').html('<pre>'+ JSON.stringify(data.updates, null, 2) +'</pre>');
    $view.modal();
  }

  function formatUser (data) {
    return data.split('@')[0];
  }

  function formatType (type) {
    switch (type) {
      case 'UPDATE': return 'Edit';
      case 'CREATE': return 'Create';
      case 'DELETE': return 'Delete';
    }
    return type;
  }
})();