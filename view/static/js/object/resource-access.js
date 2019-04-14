"use strict";

function resourceAccess (field, $field) {

  var $container = $field.closest('.form-group');
  var $lists = $container.find('.checkbox-list');
  var $tabs = $container.find('.nav-tabs a');
  var opts = field.format.options;
  var accessHtml = $container.find('.checkbox-sub.sample').clone().removeClass('sample').get(0).outerHTML;
  var fullSel = '[value="full"]';
  var fieldValue = null;

  $lists.on('change', '.checkbox-container > .checkbox-item-head .resource', function () {
    var $check = $(this);
    var $item = $check.closest('.checkbox-container');
    var $sub = $item.find('>.checkbox-sub');
    var checked = $check.is(':checked');
    if (checked) {
      $sub.find('.permission').filter(fullSel).prop('checked', true).change();
    } else {
      $sub.find('.permission').prop('checked', false).change();
    }
    renderCheckboxItemAssigned($item, $sub);
  });

  $lists.on('change', '.checkbox-container > .checkbox-sub .permission', function () {
    var $check = $(this);
    var $sub = $check.closest('.checkbox-sub');
    var $item = $sub.closest('.checkbox-container');
    var checked = $check.is(':checked');
    if ($check.is(fullSel)) {
      $sub.find('.permission').not(fullSel).prop('checked', false);
    } else {
      $sub.find(fullSel).prop('checked', false);
    }
    var $res = $item.find('> .checkbox-item-head .resource');
    $res.prop('checked', $sub.find('.permission').filter(':checked').length > 0);
    renderCheckboxItemAssigned($item, $sub);
  });

  $lists.on('change', '.checkbox-item > .checkbox-sub input', serializeInput);

  $lists.on('click', '.detail, .checkbox-item-title, .checkbox-item-subtitle, .checkbox-item-assigned', function () {
    $(this).closest('.checkbox-container').toggleClass('active');
  });

  $lists.on('click', '.checkbox-group-toggle', function () {
    var $group = $(this).closest('.checkbox-group').toggleClass('open');
  });

  $.get(opts.resourceUrl, {}).done(
    function (data) {
      for (var type in data) {
        if (data.hasOwnProperty(type)) {
          var typecode = type.replace(/[:*]/g, '-');
          var $list = $container.find('.access-tab .tab-content #nav-' + typecode + ' .checkbox-list');
          var resources = data[type];
          if (resources.length) {
            $list.html(createItems(type, resources));
            formatCheckboxAccess($field.val(), $list);
            openAssignedGroups($list);
          } else {
            $list.append('<i>Нет данных</i>');
          }
        }
      }
      $tabs.eq(0).click();
    }
  );

  function formatCheckboxAccess (value, $list) {
    value = !value ? {} : typeof value === 'string' ? JSON.parse(value) : value;
    $list = $list || $lists;
    for (var res in value) {
      if (value.hasOwnProperty(res)) {
        var $res = $lists.find('.resource[value="'+ res +'"]').prop('checked', true);
        var $item =  $res.closest('.checkbox-item');
        var $sub = $item.find('>.checkbox-sub');
        if (value[res] instanceof Array) {
          for (var i = 0; i < value[res].length; ++i) {
            $sub.find('[value="'+ value[res][i] +'"]').prop('checked', true);
          }
        }
        renderCheckboxItemAssigned($item, $sub);
      }
    }
    $field.val(JSON.stringify(value));
  }

  resourceAccess.formatCheckboxAccess = formatCheckboxAccess;

  function renderCheckboxItemAssigned($item, $sub) {
    var result = [];
    $sub.find('.permission').filter(':checked').each(function () {
      result.push($(this.parentNode).attr('title'));
    });
    $item.find('>.checkbox-item-assigned').html(result.join(' : '));
    $item.toggleClass('has-assigned', result.length > 0);
  }

  function serializeInput () {
    var result = $field.val() ? JSON.parse($field.val()) : {};
    $lists.find('.checkbox-item').find('.resource').each(function () {
      var subs = [];
      var $res = $(this).filter(':checked');
      if ($res.length) {
        var $item = $res.closest('.checkbox-item');
        $item.find('.checkbox-sub').find('.permission:checked').each(function () {
          subs.push(this.value);
        });
        result[this.value] = subs;
      } else if (result[this.value]) {
        result[this.value] = [];
      }
    });
    $field.val(JSON.stringify(result)).change();
  }

  //  GROUPS

  $lists.on('change', '.checkbox-group > .checkbox-sub .permission', function () {
    var $check = $(this);
    var isFullSel = $check.is(fullSel);
    var $sub = $check.closest('.checkbox-sub');
    var $group = $sub.closest('.checkbox-group');
    var checked = $check.is(':checked');
    var $items = $group.find('.checkbox-container.checkbox-item');
    $items.each(function () {
      var $item = $(this);
      var $sub = $item.find('>.checkbox-sub');
      var $permissions = $sub.find('.permission');
      $permissions.filter('[value="'+ $check.get(0).value +'"]').prop('checked', checked);
      if (isFullSel) {
        $permissions.not(fullSel).prop('checked', false);
      } else {
        $permissions.filter(fullSel).prop('checked', false);
      }
      var $res = $item.find('> .checkbox-item-head .resource');
      $res.prop('checked', $permissions.filter(':checked').length > 0);
      renderCheckboxItemAssigned($item, $sub);
    });
    serializeInput();
  });

  function createItems (type, data) {
    var result = '';
    switch (type) {
      case 'n:::': result = createNavGroups(data); break;
      case 'c:::': result = createClassGroups(data); break;
      case 'a:::': result = createAttrGroups(data); break;
      default:
        result = renderItems(data);
        break;
    }
    return result;
  }

  function createNavGroups (data) {
    var groups = {};
    for (var i = 0; i < data.length; ++i) {
      var parts = data[i].id.substring(4).split('@');
      var ns = parts[0];
      data[i].code = parts[1];
      if (!groups[ns]) {
        groups[ns] = {
          name: ns,
          items: [],
          map: {}
        };
      }
      groups[ns].items.push(data[i]);
      groups[ns].map[data[i].code] = data[i];
    }
    for (var ns in groups) {
      if (groups.hasOwnProperty(ns)) {
        groups[ns].items.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });
      }
    }
    return renderGroups(groups);
  }

  function createClassGroups (data) {
    var groups = {};
    for (var i = 0; i < data.length; ++i) {
      var parts = data[i].id.substring(4).split('@');
      var ns = parts[1];
      if (groups[ns]) {
        groups[ns].items.push(data[i]);
      } else {
        groups[ns] = {name: ns, items: [data[i]]};
      }
    }
    return renderGroups(groups);
  }

  function createAttrGroups (data) {
    var groups = {};
    for (var i = 0; i < data.length; ++i) {
      var parts = data[i].id.substring(4).split('@');
      parts = parts[1].split('.');
      var ns = parts[0];
      if (groups[ns]) {
        groups[ns].items.push(data[i]);
      } else {
        groups[ns] = {name: ns, items: [data[i]]};
      }
    }
    return renderGroups(groups);
  }

  function openAssignedGroups ($list) {
    $list.find('.checkbox-group').each(function () {
      var $group = $(this);
      if ($group.find('.has-assigned').length) {
        $group.addClass('open');
      }
    });
  }

  // RENDER

  function renderItems (items) {
    return items.map(function (item) {
      return renderItem(item);
    }).join('');
  }

  function renderItem (item) {
    return '<div class="checkbox-item checkbox-container"><div class="checkbox-item-head" title="'+ item.id +'">'
      + '<input type="checkbox" class="resource" value="'
      + item.id + '"><span class="checkbox-item-title">'
      + (item.name || item.id) + '</span>'
      + '<div class="checkbox-item-subtitle">' + item.id + '</div>'
      +'</div><span class="fa detail"></span><span class="checkbox-item-assigned"></span>'
      + accessHtml +'</div>';
  }

  function renderGroups (groups) {
    var result = '';
    for (var id in groups) {
      if (groups.hasOwnProperty(id)) {
        result += renderGroup(groups[id]);
      }
    }
    return result;
  }

  function renderGroup (group) {
    return '<div class="checkbox-group checkbox-container"><div class="checkbox-item-head">'
      + '<span class="checkbox-group-toggle glyphicon glyphicon-plus"></span>'
      + '<input type="checkbox" class="resource">'
      + '<span class="checkbox-item-title">' + group.name
      + '</span></div><span class="fa detail"></span><span class="checkbox-item-assigned"></span>'
      + accessHtml +'<div class="checkbox-group-list">'
      + renderItems(group.items) +'</div></div>';
  }
}