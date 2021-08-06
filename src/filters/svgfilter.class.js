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
  filters.Svgfilter = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Outline.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Svgfilter',
    svgfilter: 0,
    mainParameter: 'svgfilter',
    applyTo2d: function (options) {
      if (this.svgfilter === 0 || this.svgfilter=='') {
        return;
      }

  
   
      var h = options.imageData.height;
      var w = options.imageData.width;
      var d = new Date();
      fabric.log(d.getMinutes(),d.getSeconds() ,d.getMilliseconds());
      var canvas1 = fabric.util.createCanvasElement();
      canvas1.width = w+200;
      canvas1.height = h+200;
      var ctx = canvas1.getContext('2d');
      ctx.putImageData(options.imageData, 100, 100);
      var el = document.getElementById('svgfilter');
      if (el) el.remove();
        window.document.body.insertAdjacentHTML('afterbegin', `<svg id="svgfilter"><filter id="filter">
      ${this.svgfilter}
      </filter></svg>
      `);
  
      
      ctx.filter = 'url(#filter)';
      ctx.drawImage(canvas1, 0, 0,);

       el = document.getElementById('svgfilter');
      if (el) el.remove();
      var tcanvas = this.trimCanvas(canvas1);

      options.imageData = tcanvas.getContext('2d').getImageData(0, 0, tcanvas.width, tcanvas.height);
      d = new Date();
      fabric.log(d.getMinutes(),d.getSeconds() ,d.getMilliseconds());
    },
    // applyTo2d: function (options) {
    //   if (this.outline === 0 && this.blur === 0) {
    //     return;
    //   }
    //   var imageData = options.imageData;
    //   var offset = (this.outline *2) + (this.blur * 2);
    //   var h = imageData.height + offset ;
    //   var w = imageData.width + offset;

    //   var can = fabric.util.createCanvasElement();
    //   can.width = w;
    //   can.height = h;
    //   var ctxOrg = can.getContext('2d');
    //   ctxOrg.putImageData(options.imageData, 0, 0);


    //   var canvas1 = fabric.util.createCanvasElement();
    //   canvas1.width = w;
    //   canvas1.height = h;
    //   var ctx = canvas1.getContext('2d');
    //   ctx.shadowColor = this.color;
    //   ctx.shadowBlur = this.blur;



    //   for (var x = -this.outline; x <= this.outline; x++) {
    //     for (var y = -this.outline; y <= this.outline; y++) {
    //       ctx.shadowOffsetX = x;
    //       ctx.shadowOffsetY = y;
    //       ctx.drawImage(can, offset, offset,w-(offset*2),h-(offset*2));
    //     }
    //   }


    //   var imageData = ctx.getImageData(0, 0, w, h);
    //   options.imageData = imageData;

    // },
    // applyTo2d2: function (options) {
    //   if (this.outline === 0 && this.blur === 0) {
    //     return;
    //   }
    //   var imageData = options.imageData, data = imageData.data, i, len = data.length;

    //   fabric.log(new Date().getMilliseconds());

    //   var ratio = (parseFloat(this.outline) * 2) + (this.blur * 2) * 5;
    //   var width = options.sourceWidth + ratio * 2;
    //   var height = options.sourceHeight + ratio * 2;
    //   var canvas1 = fabric.util.createCanvasElement();
    //   canvas1.width = width;
    //   canvas1.height = height;
    //   var offx, offy;
    //   offx = offy = ratio / 2;
    //   var ctx = options.ctx;//canvas1.getContext('2d');
    //   ctx.shadowColor = this.color;
    //   i = 0;
    //   ctx.save();

    //   ctx.filter = 'blur(' + this.blur + 'px)';
    //   for (i = 0; i < 360; i += 1) {
    //     ctx.drawImage(options.canvasEl, offx + Math.sin(i) * this.outline, offy + Math.cos(i) * this.outline);
    //   }



    //   ctx.globalCompositeOperation = "source-in";
    //   ctx.fillStyle = this.color;


    //   ctx.fillRect(0, 0, width, height);

    //   ctx.restore();
    //   // ctx.globalCompositeOperation = "source-over";
    //   ctx.drawImage(options.canvasEl, offy, offy);
    //   fabric.log(new Date().getMilliseconds());

    //   var trimmedCanvas = canvas1;//this.trimCanvas(canvas1);


    //   options.canvasEl = trimmedCanvas;
    //   options.imageData = trimmedCanvas.getContext('2d').getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
    // },


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
        svgfilter: this.svgfilter
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
  fabric.Image.filters.Svgfilter.fromObject = fabric.Image.filters.BaseFilter.fromObject;
  // fabric.Image.filters.Outline.fromObject = function(object, callback) {
  //   fabric.Image.fromObject(object.image, function(image) {
  //     var options = fabric.util.object.clone(object);
  //     options.image = image;
  //     callback(new fabric.Image.filters.Outline(options));
  //   });
  // };
})(typeof exports !== 'undefined' ? exports : this);
