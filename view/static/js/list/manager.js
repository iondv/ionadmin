(function ($) {

  var OBJECT_ID = 'id'; // name of object id in database
  var rowIdPrefix = "-row-";
  var listPostfix = "-list";
  var defaultDom = "<'row'<'col-sm-6'f><'col-sm-6'l>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>";
  var maxLinesInCell;

  /*** LIST MANAGER ***/

  window.listManager = function (model, options) {

    var $table = $("#object-list");
    var $box = $table.closest(".box");
    var $loader = $box.find(".list-loader");
    var $tools = $box.find(".list-tools");
    var $select = $("#select-btn");
    var lastCreateAction = false;

    var indexedObjects = {};
    var dataTable;

    options = $.extend({
      maxLinesInCell: 5
    }, options);

    maxLinesInCell = options.maxLinesInCell;

    setSelectable($table);

    getList(function (objects) {
      dataTable = $table.DataTable($.extend({
        data: objects,
        sDom: defaultDom
      }, options.dt));
    });

    function getList(handler) {
      $loader.toggle(true);
      restApi.getList(model)
          .done(function (data) {
            var objects = data;
            prepareObjects(objects, options);
            //var objects = $.extend(true, [], options.demoData); // clone
            addRowId(objects);
            handler(objects);
            indexedObjects = objectHelper.mapArray(objects, OBJECT_ID);
          })
          .fail(function (xhr, textStatus, errorThrown) {
            messageCallout.error(xhr.responseText || errorThrown);
          })
          .always(function () {
            $loader.toggle(false);
          });
    }

    function reload() {
      getList(function (objects) {
        dataTable.clear().rows.add(objects).draw();
      });
    }

    /*** TOOLS ***/

    $select.toggle(typeof addToOpenerList === "function");
    $select.click(function () {
      var rows = dataTable.rows('.selected');
      var data = rows.data();
      if (!data.length) {
        messageCallout.warn('Выберите объекты.');
      } else if (typeof addToOpenerList === "function") {
        addToOpenerList(findObjects(getObjectIds(rows), indexedObjects));
        close();
      }
    });

    $tools.find(".reload-btn").click(function () {
      messageCallout.hide();
      reload();
    });

    $tools.find(".create-btn").click(function () {
      messageCallout.hide();
      var child = openCurrentWindow(model + "/create");
      //child.refreshOpenerList = reload;
      lastCreateAction = true;
    });

    $tools.find(".edit-btn").click(function () {
      var rows = dataTable.rows('.selected');
      var data = rows.data();
      if (data.length === 1) {
        var child = openCurrentWindow(model, data[0][OBJECT_ID]);
        // child.refreshOpenerList = reload;
        messageCallout.hide();
      } else {
        messageCallout.warn('Выберите один объект для редактирования.');
      }
    });

    $tools.find(".delete-btn").click(function () {
      var rows = dataTable.rows('.selected');
      if (rows.data().length === 0) {
        messageCallout.warn('Выберите объекты для удаления.');
      } else if (confirm("Удалить выбранные объекты?")) {
        messageCallout.hide();
        $loader.toggle(true);
        restApi.removeList(model, getObjectIds(rows))
            .done(function () {
              rows.remove().draw();
            })
            .fail(function (xhr, textStatus, errorThrown) {
              messageCallout.error(xhr.responseText || (errorThrown ? errorThrown : textStatus));
            })
            .always(function () {
              $loader.toggle(false);
            });
      }
    });
  };

  /***/
  /*** OBJECT LIST MANAGER ***/
  /***/

  window.objectListManager = function (attr, model, $table, options) {

    var $box = $table.closest(".box");
    var $tools = $table.prev(".list-tools");
    var sourceObjects = [];
    var indexedObjects = {};

    var dataTable = $table.DataTable($.extend({
      sDom: defaultDom
    }, options.dt));

    setSelectable($table);

    /*** UPDATE ***/

    function appendObjects(objects) {
      objects = filterAppendedObjects(objects);
      dataTable.rows.add(objects).draw();
      setFormValue();
      if (objects.length) {
        options.$field.trigger("change"); // hidden input fire event
      }
    }

    function updateObject(id) {
      if (!id || !indexedObjects.hasOwnProperty(id)) return;
      // reload object in list
      //$loader.toggle(true);
      restApi.get(model, id)
          .done(function (data) {
            prepareObjects(data);
            indexedObjects[id] = data;
            replaceObjectInArray(sourceObjects, data, OBJECT_ID);
            dataTable.clear().rows.add(sourceObjects).draw();
          })
          .complete(function () {
            //$loader.hide();
          });
    }

    function reload(objects) {
      if (!objects) return;
      if (!(objects instanceof Array)) {
        objects = [objects];
      }
      prepareObjects(objects, options);
      addRowId(objects, attr);
      sourceObjects = objects;
      indexedObjects = objectHelper.mapArray(objects, OBJECT_ID);
      dataTable.clear().rows.add(objects).draw();
      setFormValue();
    }

    function setFormValue() {
      // serialize object ids to the hidden form input
      options.$field.val(getObjectIds(dataTable.rows()).join(","));
    }

    function filterAppendedObjects(objects) {
      var adds = [];
      for (var i = 0; i < objects.length; ++i) {
        var object = objects[i];
        if (!indexedObjects.hasOwnProperty(object[OBJECT_ID])) {
          adds.push(object);
          indexedObjects[object[OBJECT_ID]] = object;
          sourceObjects.push(object);
        }
      }
      return adds;
    }

    /*** OBJECT LIST TOOLS ***/

    $tools.find(".add-btn").click(function () {
      if (options.maxObjects && dataTable.page.info().recordsTotal >= options.maxObjects) {
        console.log("Limit max objects");
        return;
      }
      var child = openNewWindow(model + listPostfix);
      child.addToOpenerList = appendObjects;
      child.isOpenerListMultiSelect = $table.hasClass("multi-selectable");
    });

    $tools.find(".edit-btn").click(function () {
      var rows = dataTable.rows('.selected');
      var data = rows.data();
      if (data.length === 1) {
        var child = openNewWindow(model, data[0][OBJECT_ID]);
        child.refreshOpenerList = updateObject;
      } else {
        console.log("Select one object");
      }
    });

    $tools.find(".delete-btn").click(function () {
      var rows = dataTable.rows('.selected');
      if (rows.data().length === 0) {
        console.log("Select objects");
      } else if (confirm("Удалить выбранные объекты?")) {
        var ids = getObjectIds(rows);
        unsetObjectKeys(indexedObjects, ids);
        removeObjectsByKeyValues(sourceObjects, OBJECT_ID, ids);
        rows.remove().draw();
        setFormValue();
        options.$field.trigger("change");
      }
    });

    return {
      dataTable: dataTable,
      reload: reload
    };
  };

  /*** PREPARE DATA ***/

  function prepareDtOptions(dt) {
    var items = dt.aoColumns;
    for (var i = 0; i < dt.aoColumns.length; ++i) {
      if (typeof items[i].mRender === 'string' && dataTableFormatter[items[i].mRender]) {
        items[i].mRender = dataTableFormatter[items[i].mRender];
      }
    }
  }

  function prepareObjects(objects, options) {
    var template = {};
    for (var i = 0; i < options.dt.aoColumns.length; ++i) {
      template[options.dt.aoColumns[i].mData] = null;
    }
    for (var i = 0; i < objects.length; ++i) {
      var object = objects[i];
      for (var key in template) {
        if (!(object.hasOwnProperty(key)) || object[key] === null)
          object[key] = '';
      }
    }
    console.log('Objects prepared!');
  }

  /*** NEW WINDOW  ***/

  function openNewWindow(path, id) {
    return open('ionadmin/' + path + (id ? ("/" + id) : ""));
  }

  function openCurrentWindow(path, id) {
    return location.assign('/ionadmin/' + path + (id ? ("/" + id) : ""));
  }

  /*** LIST ROWS ***/

  function setSelectable($table) {
    var isOpener = typeof isOpenerListMultiSelect !== "undefined";
    if ((!isOpener || isOpenerListMultiSelect) && $table.hasClass("multi-selectable")) {
      $table.on("click", "tr", function (event) {
        if (!event.ctrlKey) {
          $table.find("tr.selected").not(this).removeClass('selected');
        }
        $(this).addClass('selected');
      });
      $table.on("dblclick", "tr", function (event) {
        $table.closest('.box-body').find(".edit-btn").click();
      });
    } else if ((isOpener && !isOpenerListMultiSelect) || $table.hasClass("selectable")) {
      $table.on("click", "tr", function (event) {
        $table.find("tr.selected").not(this).removeClass('selected');
        $(this).toggleClass('selected');
      });
    }
  }

  function getObjectIds(rows) {
    var data = rows.data();
    var ids = [];
    for (var i = 0; i < data.length; ++i) {
      ids.push(data[i][OBJECT_ID]);
    }
    return ids;
  }

  function findObjects(ids, indexedObjects) {
    var objects = [];
    for (var i = 0; i < ids.length; ++i) {
      objects.push(indexedObjects[ids[i]]);
    }
    return objects;
  }

  function addRowId(objects, attr) {
    var prefix = (attr ? attr : "") + rowIdPrefix;
    for (var i = 0; i < objects.length; ++i) {
      objects[i].DT_RowId = prefix + objects[i][OBJECT_ID];
    }
  }

  /*** FORMATTER ***/
  // http://datatables.net/blog/2012-07-09

  dataTableFormatter = {
    "boolean": function (data, type, full) {
      return !!data ? "Да" : "Нет";
    },
    "date": function (data, type, full) {
      // format only displayed and filter data, not ordering
      return (type === "display" || type === "filter")
          ? window.getUserDateFromServerDate(data)
          : data;
    },
    "image": function (data, type, full) {
      return data ? '<image src="/preview/' + data + '" class="list-image thumbnail">' : "";
    },
    "list": function (data, type, full, attr, format) {
      var result = '';
      if (data instanceof Array) {
        result += decorateMaxLinesInCell(data, function (item) {
          return '<div>'+ item +'</div>'
        });
      }
      return result;
    },
    "objectListAttr": function (data, type, full, attr, format) {
      if (!data.length) {
        return null;
      }
      var result = '';
      for (var i = 0; i < data.length; ++i) {
        var item = data[i];
        switch (format) {
          default:
            result += attrFormatterDefault(attr, item);
            break;
        }
      }
      return result;
    },
    'userRoles': function (data, type, full, attr, format) {
      var result = '';
      if (data instanceof Array) {
        data = data.filter(function (item) {
          return item;
        });
        data.sort(function (a, b) {
          return a && b ? (a.name > b.name ? 1 : a.name < b.name ? -1 : 0) : 0;
        });
        for (var i = 0; i < data.length; ++i) {
          var item = data[i];
          result += '<div>'+(item.name ? item.name : item.id)+'</div>';
        }
      }
      return result;
    }
  };

  function decorateMaxLinesInCell (data, handler) {
    var result= '';
    var max = maxLinesInCell && maxLinesInCell < data.length ? maxLinesInCell : data.length;
    for (var i = 0; i < max; ++i) {
      result += handler(data[i]);
    }
    if (max < data.length) {
      result += '<span class="" title="Скрыто записей">... ['+ (data.length - max) +']</span>';
    }
    return result;
  }

  function attrFormatterDefault(attr, data) {
    return data ? '<div>' + data[attr] + '</div>' : '';
  }

})(jQuery);
