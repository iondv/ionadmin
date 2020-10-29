
(function ($) {

  $.fn.ionadminRecache = function(options) {
    this.each(function(){
      var $this = $(this);
      var $ul = $this.find('ul.ui-sortable');
      var $tabLogs = $this.find('#tab_log');
      var $hrefTabLogs = $this.find('a[href="#tab_log"]');
      var $skipcd = $('#skipcd');
      var es = null;

      $.get('ionadmin/api/recache/list')
        .done(function (data) {
          if (data && data.length) {
            for (var i = 0; i < data.length; i++) {
              if (data[i] && data[i].caption && data[i].cname) {
                $ul.append(
                  '<li>' +
                  '<input type="checkbox" value="" data-classname="'+ data[i].cname +'">' +
                  '<span class="text">'+data[i].caption+'</span>' +
                  ' ['+ data[i].cname +']' +
                  '</li>'
                );
              }
            }
            $ul.find('li').on('click', function(){
              var chk = $(this).find('input[type=checkbox]');
              chk.prop('checked',!chk.is(':checked'));
            });
          }
        });

      function createLog (type, log) {
        var cl = 'text-muted';
        if (type === 'warn') {
          cl = 'text-yellow';
        } else if (type === 'err') {
          cl = 'text-red';
        }
        $tabLogs.append('<p class="'+cl+'">'+log+'</p>');
      }

      function listenEs(classes, skipDeps) {
        $tabLogs.empty();
        if (!es) {
          try {
            var c = window.btoa(unescape(encodeURIComponent(JSON.stringify(classes))));
            es = new EventSource('ionadmin/api/recache/start?classes=' + c + (skipDeps ? '&skipcd=true' : ''));
          } catch (e) {
            console.error(e);
            createLog('err', 'query error');
            return;
          }

          es.onmessage = function(e) {
            createLog('log', e.data);
          };      

          es.onerror = function(e) {
            es.close();
          };

          es.addEventListener('warn', function(e) {
            createLog('warn', e.data);
          });

          es.addEventListener('err', function(e) {
            createLog('err', e.data);
          });
        }
      }

      function refresh() {
        var classes = [];
        $ul.find('input[type=checkbox]:checked')
          .each(function() {
            classes.push($(this).data('classname'));
          })
        $hrefTabLogs.tab('show');
        listenEs(classes, $skipcd.prop('checked'));
      }

      $this.find('button#refresh')
        .on('click', refresh);

      $this.find('button#check-all')
        .on('click', function(){
          $ul.find('input[type=checkbox]').prop('checked', true);
        });

      $this.find('button#uncheck-all')
        .on('click', function(){
          $ul.find('input[type=checkbox]').prop('checked', false);
        });

    });
    return this;
  }

})(jQuery);
