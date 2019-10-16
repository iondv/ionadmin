/**
 * Created by kalias_90 on 05.04.18.
 */

(function ($) {

  var methods = {
    init : function(opts) {

      var _this = $(this);
      var table = $("#object-list", _this);
      var loader = $(".list-loader", _this);
      var tools = $(".list-tools", _this);
      var reloadBtn = $(".reload-btn", tools);
      var createBtn = $(".create-btn", tools);
      var editBtn = $(".edit-btn", tools);
      var deleteBtn = $(".delete-btn", tools);

      var options = $.extend({
        keyProp: "_id",
        params: {},
        urls: {
          list: "/",
          create: "/create",
          edit: "/",
          delete: "/delete/"
        }
      }, opts);
      var dtOptions = $.extend({
        paging: true,
        pageLength: 15,
        serverSide: true,
        select: true,
        dom: "<'row'<'col-sm-6'f><'col-sm-6'l>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
        ajax: function (d, callback, settings) {
          var info = $(this).DataTable().page.info();
          loader.toggle(true);
          var data =  {
            start: info.start,
            length: info.length,
          };
          for(var f in options.params) {
            var v = options.params[f];
            if (typeof v === "function") {
              v = v.apply(_this, []);
            } else if (v instanceof jQuery) {
              v = v.val();
            }
            if (v) {
              data[f] = v;
            }
          }
          $.get(options.urls.list, data)
            .done(function (data) {
              callback({
                data: data,
                draw: settings.iDraw,
                recordsTotal: data[0] ? data[0].__total : null
              });
            })
            .fail(function (xhr, textStatus, errorThrown) {
              messageCallout.error(xhr.responseText || errorThrown);
            })
            .always(function () {
              loader.toggle(false);
            });
        },
        createdRow: function(row, data, dataIndex) {
          $(row).attr('id', data[options.keyProp]);
        }
      }, opts.dt);

      var dataTable = table.DataTable(dtOptions);

      dataTable.on("click", "tr", function () {
        if (!event.ctrlKey) {
          $(this).siblings(".selected").removeClass('selected');
        }
        $(this).toggleClass('selected');
      }).on("dblclick", "tr", function () {
        editBtn.click();
      });


      reloadBtn.on('click', function () {
        messageCallout.hide();
        dataTable.ajax.reload();
      });
      createBtn.on('click', function () {
        messageCallout.hide();
        return location.assign(options.urls.create);
      });
      editBtn.on('click', function () {
        var selected = $('tr.selected', table);
        if (selected.length === 1) {
          messageCallout.hide();
          return location.assign(options.urls.edit + "/" + selected.attr('id'));
        } else {
          messageCallout.warn('Выберите один объект для редактирования.');
        }
      });
      deleteBtn.on('click', function () {
        if (table.has('tr.selected')) {
          var selected = $('tr.selected', table);
          if (confirm("Удалить выбранные объекты?")) {
            messageCallout.hide();
            loader.toggle(true);
            $.post(options.urls.delete, {
              ids: selected.map(function (i, e) { return $(e).attr('id'); }).get()
            })
            .done(function () {
              reloadBtn.click();
            })
            .fail(function (xhr, textStatus, errorThrown) {
              messageCallout.error(xhr.responseText || (errorThrown ? errorThrown : textStatus));
            })
            .always(function () {
              loader.toggle(false);
            });

          }
        } else {
          messageCallout.warn('Выберите объекты для удаления.');
        }
      });
    }
  };

  $.fn.listManager = function(method) {
    var args = arguments;
    return this.each(function () {
      if ( methods[method] ) {
        return methods[method].apply(this, Array.prototype.slice.call(args, 1));
      } else if ( typeof method === 'object' || ! method ) {
        return methods.init.apply(this, args);
      } else {
        $.error( 'Метод с именем ' +  method + ' не определён для listManager' );
      }
    });
  }
})(jQuery);