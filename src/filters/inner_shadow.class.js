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
  filters.InnerShadow = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Outline.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'InnerShadow',
    color: '#000000',
    // /**
    //  * Fragment source for the myParameter program
    //  */
    // fragmentSource: 'precision highp float;\n' +
    //   'uniform sampler2D uTexture;\n' +
    //   'uniform vec4 uLow;\n' +
    //   'uniform vec4 uHigh;\n' +
    //   'varying vec2 vTexCoord;\n' +
    //   'void main() {\n' +
    //     'vec4 color = texture2D(uTexture, vTexCoord);\n' +
    //     // add your gl code here
    //     'gl_FragColor = color;\n' +
    //   '}',

    width: 0,
    blur: 0,
    x:10,
    y:10,

    applyTo2d: function (options) {

      if (this.width === 0 && this.blur === 0) {
        // early return if the parameter value has a neutral value
        return;
      }
      var w = options.sourceWidth;
      var h = options.sourceHeight;
      var can = fabric.util.createCanvasElement();
      can.width = options.sourceWidth;
      can.height = options.sourceHeight;
      var i = 1;
      var ct = can.getContext('2d');
      ct.fillStyle = "black";
      ct.filter = "blur(" + this.width + "px)";
      ct.shadowColor = "black";
      ct.shadowBlur = this.width;
      shadowOffsetX = this.x;
      ct.shadowOffsetY = this.y;

      ct.fillRect(0, 0, w, h);
      ct.globalCompositeOperation = "destination-out";
      ct.drawImage(options.canvasEl, 0, 0, w, h);

      var can2 = fabric.util.createCanvasElement();
      can2.width = options.sourceWidth;
      can2.height = options.sourceHeight;
      var ct2 = can2.getContext('2d');
      ct2.drawImage(can, 0, 0);
      for (; i < this.blur; i++) {
        ct2.drawImage(can, 0, 0);
      }

      var can1 = document.createElement("canvas");
      can1.width = w;
      can1.height = h;
      var ct1 = can1.getContext("2d");
      ct1.drawImage(options.originalEl, 0, 0);
      // ct1.globalCompositeOperation = "destination-out";
      ct1.drawImage(can2, 0, 0);
      ct1.globalCompositeOperation = "source-over";


      var trimmedCanvas = this.trimCanvas(can1);

      options.imageData = trimmedCanvas.getContext('2d').getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
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
