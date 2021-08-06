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
    color: null,
    innershadow: null,
    x: null,
    y: null,
    blend: null,
    mainParameter: 'innershadow',


    applyTo2d: function (options) {
      if (!this.innershadow) {
        return;
      }
      fabric.log(new Date().getMinutes(),new Date().getSeconds(), new Date().getMilliseconds());
      // var imageData = options.imageData;
      var w = options.sourceWidth;
      var h = options.sourceHeight;
      var x = Number(this.x) || 0;
      var y = Number(this.y) || 0;
      var blur = Number(this.innershadow) || 10;
      var color = this.color || 'black';
      var blend = this.blend || 'multiply';
      // var can1 = fabric.util.createCanvasElement();
      // can1.width = w;
      // can1.height = h;
      // var ctxOrg = can1.getContext('2d');
      // ctxOrg.putImageData(options.imageData, 0, 0);

      // 
      // var can = fabric.util.createCanvasElement();
      // var can = new OffscreenCanvas(options.sourceWidth, options.sourceHeight);
      var can = document.createElement('canvas');
      can.width = options.sourceWidth;
      can.height = options.sourceHeight;
      var i = 1;
      var ct = can.getContext('2d');
      ct.putImageData(options.imageData, 0, 0);
      // ct.drawImage(can1, 0, 0,);
      var el = document.getElementById('svgfilter');
      if (el) el.remove();

      window.document.body.insertAdjacentHTML('afterbegin', `<svg id="svgfilter"><filter id="filter">
      <feOffset dx="${x}" dy="${y}" in="SourceAlpha" result="offset1"/>
                                  <feGaussianBlur stdDeviation="${blur}" in="offset1" edgeMode="none" result="blur1"/>
                                  <feComposite in="SourceAlpha" in2="blur1" operator="out" result="composite1"/>
                                  <feFlood flood-color="${color}" flood-opacity="1"  result="flood5"/>
                                  <feComposite in="flood5" in2="composite1" operator="in"  result="composite3"/>
                                  <feBlend mode="${blend}" in="SourceGraphic" in2="composite3" result="blend5"/>
                                  </filter></svg>`);
      // const svg = `<svg id="svgfilter"><filter id="filter">
      //                             <feOffset dx="${x}" dy="${y}" in="SourceAlpha" result="offset1"/>
      //                             <feGaussianBlur stdDeviation="${blur}" in="offset1" edgeMode="none" result="blur1"/>
      //                             <feComposite in="SourceAlpha" in2="blur1" operator="out" result="composite1"/>
      //                             <feFlood flood-color="${color}" flood-opacity="1"  result="flood5"/>
      //                             <feComposite in="flood5" in2="composite1" operator="in"  result="composite3"/>
      //                             <feBlend mode="${blend}" in="SourceGraphic" in2="composite3" result="blend5"/>
      //                             </filter></svg>`,
      // blob = new Blob([svg], { type: 'image/svg+xml' }),
      // url = URL.createObjectURL(blob);                   

      // ct.filter = `url('${url}#filter')`;

      ct.filter = 'url(#filter)';
      // ct.globalCompositeOperation = this.blend;








      ct.drawImage(can, 0, 0,);
      el = document.getElementById('svgfilter');
      if (el) el.remove();

      options.imageData = ct.getImageData(0, 0, w, h);;
      fabric.log(new Date().getMinutes(),new Date().getSeconds(), new Date().getMilliseconds());
      can.remove();
    },
    applyTo2d1: function (options) {

      if (this.innershadow === 0 && this.offsetX === 0 && this.offsetY === 0) {
        // early return if the parameter value has a neutral value
        return;
      }
      var imageData = options.imageData;
      var w = options.sourceWidth;
      var h = options.sourceHeight;

      var can1 = fabric.util.createCanvasElement();
      can1.width = w;
      can1.height = h;
      var ctxOrg = can1.getContext('2d');
      ctxOrg.putImageData(options.imageData, 0, 0);


      var can = fabric.util.createCanvasElement();
      can.width = options.sourceWidth;
      can.height = options.sourceHeight;
      var i = 1;
      var ct = can.getContext('2d');

      ct.fillStyle = "black";
      ct.fillRect(0, 0, w, h);
      ct.globalCompositeOperation = "destination-out";

      ct.drawImage(can1, 0, 0, w, h);
      ct.globalCompositeOperation = "source-out";

      ct.shadowColor = "black";
      ct.shadowBlur = this.innershadow * 2;
      ct.shadowOffsetX = this.x;
      ct.shadowOffsetY = this.y;
      ct.drawImage(can1, 0, 0, w, h);
      ct.globalCompositeOperation = "source-in";
      ct.shadowColor = "transparent";
      ct.fillStyle = this.color;
      ct.fillRect(0, 0, w, h);




      ctxOrg.globalCompositeOperation = this.blend;
      ctxOrg.drawImage(can, 0, 0);
      ctxOrg.globalCompositeOperation = "source-over";

      var imageData = ctxOrg.getImageData(0, 0, w, h);
      options.imageData = imageData;


      // var trimmedCanvas = can2;//this.trimCanvas(can);

      // options.imageData = trimmedCanvas.getContext('2d').getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
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
        blend: this.blend,
        innershadow: this.innershadow,
        color: this.color,
        x: this.x,
        y: this.y
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
  fabric.Image.filters.InnerShadow.fromObject = fabric.Image.filters.BaseFilter.fromObject;
  // fabric.Image.filters.Outline.fromObject = function(object, callback) {
  //   fabric.Image.fromObject(object.image, function(image) {
  //     var options = fabric.util.object.clone(object);
  //     options.image = image;
  //     callback(new fabric.Image.filters.Outline(options));
  //   });
  // };
})(typeof exports !== 'undefined' ? exports : this);
