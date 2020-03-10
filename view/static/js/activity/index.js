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
  var $filter = $tools.find('.filter');
  var filters = {
    $period: $tools.find('.period-filter'),
    $user: $tools.find('.user-filter'),
    $disabled: $tools.find('.disabled-filter')
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

  filters.$user.select2({
    width: '100%'
  });

  $tools.find('.reset-filter').click(function () {
    filters.$period.data('daterangepicker').setStartDate(defaultSince);
    filters.$period.data('daterangepicker').setEndDate(defaultTill);
    filters.$user.val('').change();
    filters.$disabled.val('');
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
      url: 'ionadmin/api/activity/list',
      type: 'POST',
      data: function (data) {
        var s = moment(since);
        var t = new Date(till);
        t.setDate(t.getDate() + 1);
        t = moment(t);
        data.filter = {
          since: s.toISOString(),
          till: t.toISOString(),
          user: filters.$user.val(),
          disabled: filters.$disabled.val()
        };
      }
    },
    aoColumns: [{
      mData: "lastVisit",
      sTitle: "Дата/время последнего входа",
      mRender: function (data, type, full) {
        return type === "display" ? (new Date(data)).toLocaleString() : data;
      },
      orderable: false
    },{
      mData: "userName",
      sTitle: "Пользователь",
      orderable: false
    },{
      mData: "isDisabled",
      sTitle: "Метка о блокировке",
      orderable: false,
      mRender: function (data, type, full) {
        if (typeof data === 'boolean') {
          return data ? 'Заблокирован' : 'Допущен';
        }
        return data;
      },
    }]
  });

  $table.on('click', 'tr', function (event) {
    $table.find('tr.selected').removeClass('selected');
    $(this).toggleClass('selected');
  });

})();