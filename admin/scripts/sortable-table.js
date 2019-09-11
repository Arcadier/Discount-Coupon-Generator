/*! sortable-table.js | (c) 2014 Daniel Imms | github.com/Tyriar/sortable-table.js/blob/master/LICENSE */

(function($, document) {
    'use strict';
  
    var SORTED_CLASS = 'sorted';
    var DESC_CLASS = 'desc';
  
    $(document).ready(function () {
      var sortableTables = $('table.sortable');
  
      for (var i = 0; i < sortableTables.length; i++) {
        var sortableTable = sortableTables.eq(i);
        var sorted = false;
        var ths = sortableTable.find('thead tr').children();
        var th;
        var j;
  
        for (j = 0; j < ths.length; j++) {
          th = ths.eq(j);
          if (th.hasClass(SORTED_CLASS)) {
            // toggle so it sorts correct order
            th.toggleClass(DESC_CLASS);
            sortTable(sortableTable, th);
            sorted = true;
            break;
          }
        }
  
        for (j = 0; j < ths.length; j++) {
          th = ths.eq(j);
  
          // Assume sorted by first column if class not present
          if (!sorted && j === 0) {
            th.addClass(SORTED_CLASS);
          }
  
          th.attr('tabindex', '0')
            .attr('title', 'Sort by ' + th.text().toLowerCase() + ' column');
          $('<span>').appendTo(th); // CSS sort arrow after header
          th.click(triggerSort)
            .keydown(triggerSort);
        }
      }
    });
  
    function triggerSort(event) {
      if (event.type === 'click' || event.keyCode === 13) {
        sortTable($(this).closest('table'), this);
      }
    }
  
    function updateTable(table, rows, sortTh) {
      sortTh = $(sortTh);
      var sortDesc = (sortTh.hasClass(SORTED_CLASS) &&
                      !sortTh.hasClass(DESC_CLASS));
      var jqRows = $(rows);
  
      for (var i = 0; i < jqRows.length; i++) {
        var row = jqRows.eq(i);
        if (sortDesc) {
          // desc
          row.prependTo(table);
        } else {
          // acs
          row.appendTo(table);
        }
      }
  
      if (sortTh.hasClass(SORTED_CLASS)) {
        sortTh.toggleClass(DESC_CLASS);
      } else {
        var ths = $(table).find('th');
        ths.removeClass(SORTED_CLASS);
        ths.removeClass(DESC_CLASS);
        sortTh.addClass(SORTED_CLASS);
      }
  
      $(table).find('thead').prependTo(table);
    }
  
    function sortTable(table, header) {
      var columnIndex = $(header).index();
      var rows = table.find('tbody').get();
      var orderedRows = mergeSortRows(rows, columnIndex);
      updateTable(table, orderedRows, header);
    }
  
    function mergeSortRows(rows, col) { // column is 0-based
      if (rows.length <= 1) {
        return rows;
      }
  
      var left = [];
      var right = [];
      var middle = Math.floor(rows.length / 2);
      $(rows).each(function (i, row) {
        if (i < middle) {
          left[i] = row;
        } else {
          right[i - middle] = row;
        }
      });
  
      return merge(mergeSortRows(left, col), mergeSortRows(right, col), col);
    }
  
    function merge(left, right, col) {
      var results = [];
  
      while (left.length > 0 || right.length > 0) {
        if (left.length > 0 && right.length > 0) {
          if (rowCompare(left[0], col) <= rowCompare(right[0], col)) {
            results.push(left.shift());
          } else {
            results.push(right.shift());
          }
        } else if (left.length > 0) {
          results.push(left.shift());
        } else if (right.length > 0) {
          results.push(right.shift());
        }
      }
  
      return results;
    }
  
    function rowCompare(row, column) {
      return $(row).find('td').eq(column).text().toLowerCase();
    }
  }(jQuery, document));
  