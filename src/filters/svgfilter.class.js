(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
    filters = fabric.Image.filters,
    createClass = fabric.util.createClass;

  /**
   * Outline filter class
   * @class fabric.Image.filters.Outline
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @see {@link fabric.Image.filters.Outline#initialize} for constructor definition
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @example
   * var filter = new fabric.Image.filters.Outline({
   *   add here an example of how to use your filter
   * });
   * object.filters.push(filter);
   * object.applyFilters();
   */
  filters.CustomStyle = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Outline.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'CustomStyle',
    customstyle: '',
    mainParameter: 'customstyle',
    applyTo2d: function (options) {
      if (this.customstyle === 0 || this.customstyle == '' || !this.customstyle) {
        return;
      }



      var h = options.imageData.height;
      var w =  options.imageData.width;
      // var d = new Date();
      //fabric.log(d.getMinutes(), d.getSeconds(), d.getMilliseconds());
      var canvas = fabric.util.createCanvasElement();
      canvas.width = w + 100;
      canvas.height = h + 100;
      var ctx = canvas.getContext('2d');
      ctx.putImageData(options.imageData, 50, 50);
      // ctx.drawImage(options.canvasEl, 50, 50);
      var el = document.getElementById('svgfilter');
      if (el) el.remove();
      window.document.body.insertAdjacentHTML('afterbegin', `<svg id="svgfilter"><filter id="filter">${this.customstyle}</filter></svg>`);


      ctx.filter = 'url(#filter)';
      ctx.drawImage(canvas, 0, 0);

      el = document.getElementById('svgfilter');
      if (el) el.remove();
      var tcanvas = this.trimCanvas(canvas);
      // options.imageData.height = tcanvas.height;
      // options.imageData.width = tcanvas.width;
      // options.imageData = tcanvas.getContext('2d').getImageData(0, 0, tcanvas.width > canvas.width ? tcanvas.width : canvas.width, tcanvas.height > canvas.height ? tcanvas.height : canvas.height);
      // d = new Date();
      options.imageData = tcanvas.getContext('2d').getImageData(0, 0, tcanvas.width, tcanvas.height);

      if (canvas) canvas.remove();
      //fabric.log(d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    },

    trimCanvas: function (c) {
      var ctx = c.getContext('2d'),
        copy = document.createElement('canvas').getContext('2d'),
        pixels = ctx.getImageData(0, 0, c.width, c.height),
        l = pixels.data.length,
        i,
        bound = {
          top: null,
          left: null,
          right: null,
          bottom: null
        },
        x, y;

      // Iterate over every pixel to find the highest
      // and where it ends on every axis ()
      for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
          x = (i / 4) % c.width;
          y = ~~((i / 4) / c.width);

          if (bound.top === null) {
            bound.top = y;
          }

          if (bound.left === null) {
            bound.left = x;
          }
          else if (x < bound.left) {
            bound.left = x;
          }

          if (bound.right === null) {
            bound.right = x;
          }
          else if (bound.right < x) {
            bound.right = x;
          }

          if (bound.bottom === null) {
            bound.bottom = y;
          }
          else if (bound.bottom < y) {
            bound.bottom = y;
          }
        }
      }

      // Calculate the height and width of the content
      var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left,
        trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

      copy.canvas.width = trimWidth;
      copy.canvas.height = trimHeight;
      copy.putImageData(trimmed, 0, 0);

      // Return trimmed canvas
      return copy.canvas;
    },

    toObject: function () {
      var ob = {
        customstyle: this.customstyle
      };
      return fabric.util.object.extend(this.callSuper('toObject'), ob);
    }




  });

  /**
 * Returns filter instance from an object representation
 * @static
 * @param {Object} object Object to create an instance from
 * @param {function} [callback] to be invoked after filter creation
 * @return {fabric.Image.filters.Outline} Instance of fabric.Image.filters.Outline
 */
  fabric.Image.filters.CustomStyle.fromObject = fabric.Image.filters.BaseFilter.fromObject;
  // fabric.Image.filters.Outline.fromObject = function(object, callback) {
  //   fabric.Image.fromObject(object.image, function(image) {
  //     var options = fabric.util.object.clone(object);
  //     options.image = image;
  //     callback(new fabric.Image.filters.Outline(options));
  //   });
  // };
})(typeof exports !== 'undefined' ? exports : this);
