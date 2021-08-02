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
  filters.Outline = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Outline.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Outline',


    outline: 0,
    blur: 0,
    color: '#000000',
    // inset: false,
    mainParameter: 'outline',
    applyTo2d1: function (options) {
      if (this.outline === 0 && this.blur === 0) {
        return;
      }
      var dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
        s = this.outline || 2,  // thickness scale
        b = this.blur || 0,
        c = this.color || 'black',
        i = 0,  // iterator
        x = s + b,  // final position
        y = s + b;
      var offset = (s * 2) + (b * 2);
      var h = options.imageData.height + (offset * 2);
      var w = options.imageData.width + (offset * 2);
      var can = fabric.util.createCanvasElement();
      can.width = w;
      can.height = h;
      var ctxOrg = can.getContext('2d');
      ctxOrg.putImageData(options.imageData, s + b, s + b);
      var canvas1 = fabric.util.createCanvasElement();
      canvas1.width = w;
      canvas1.height = h;
      var ctx = canvas1.getContext('2d');
      if (b) ctx.filter = 'blur(' + this.blur + 'px)';
      for (; i < dArr.length; i += 2) { ctx.drawImage(can, x + dArr[i] * s, y + dArr[i + 1] * s, w, h); }
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, w, h);
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(can, x, y, w, h);
      options.imageData = ctx.getImageData(0, 0, w, h);

    },
    applyTo2d: function (options) {
      if (this.outline === 0 && this.blur === 0) {
        return;
      }
      var s = this.outline || 2,  // thickness scale
      b = this.blur || 0,
      c = this.color || 'black',
      i = 0;  // iterator
      var offset = (s * 2) + (b * 2);
      var h = options.imageData.height + (offset * 2);
      var w = options.imageData.width + (offset * 2);
      var can = fabric.util.createCanvasElement();
      can.width = w;
      can.height = h;
      var ctxOrg = can.getContext('2d');
      ctxOrg.putImageData(options.imageData, s + b, s + b);
    
       var canvas1 = fabric.util.createCanvasElement();
      canvas1.width = w;
      canvas1.height = h;
      var ctx = canvas1.getContext('2d');
     
          window.document.body.insertAdjacentHTML('afterbegin', `<svg id="svgfilter"><filter id="filter">
	<feMorphology operator="dilate" radius="${s}"  in="SourceAlpha" result="morphology"/>
	<feGaussianBlur stdDeviation="${b}" in="morphology" edgeMode="none" result="blur"/>
	<feFlood flood-color="${c}" flood-opacity="1" result="flood3"/>
	<feComposite in="flood3" in2="blur" operator="in"  result="composite"/>
	<feBlend mode="normal" in="SourceGraphic" in2="composite" result="blend4"/>
</filter></svg>`);
ctx.filter = 'url(#filter)';

ctx.drawImage(can, offset, offset,);
var el = document.getElementById('svgfilter');
if (el) el.remove();

  


     
      options.imageData = ctx.getImageData(0, 0, w, h);

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
        outline: this.outline,
        blur: this.blur,
        color: this.color
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
  fabric.Image.filters.Outline.fromObject = fabric.Image.filters.BaseFilter.fromObject;
  // fabric.Image.filters.Outline.fromObject = function(object, callback) {
  //   fabric.Image.fromObject(object.image, function(image) {
  //     var options = fabric.util.object.clone(object);
  //     options.image = image;
  //     callback(new fabric.Image.filters.Outline(options));
  //   });
  // };
})(typeof exports !== 'undefined' ? exports : this);
