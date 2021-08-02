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
  filters.Embossed = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Outline.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Embossed',
    light: '',
    shadow: '',
    embossed: 0,
    invert: false,
    blur: 0,
    tune: false,
    mainParameter: 'embossed',
    applyTo2d1: function (options) {

      if (this.embossed === -1) {
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

      var xOffset = 0;
      var yOffset = 0;
      var angle = this.angle?this.angle:50 * Math.PI / 180;
      this.blur = this.blur?this.blur:10;
      var x = this.embossed * Math.sin(angle) + xOffset;
      var y = this.embossed * Math.cos(angle) + yOffset;





      if (this.invert) {
        
        [x, y] = [-y, -x];
      }




      ct.fillStyle = "black";
      ct.fillRect(0, 0, w, h);
      ct.globalCompositeOperation = "destination-out";
      ct.drawImage(can1, 0, 0, w, h);
      ct.globalCompositeOperation = "source-out";
      ct.shadowColor = "black";
      ct.shadowBlur = this.blur;
      if (this.tune){
        ct.filter = 'blur('+this.blur+'px)';
      }
      
     
      
      ct.shadowOffsetX = -x;
      ct.shadowOffsetY = -y;
      ct.drawImage(can1, 0, 0, w, h);
      ct.globalCompositeOperation = "source-in";
      ct.shadowColor = "transparent";
      ct.fillStyle = this.shadow; /// change
      ct.fillRect(0, 0, w, h);
  
      ctxOrg.globalCompositeOperation = 'multiply'; //change
      ctxOrg.drawImage(can, 0, 0);
      ctxOrg.globalCompositeOperation = "source-over";




      ct.fillStyle = "black";
      ct.fillRect(0, 0, w, h);
      ct.globalCompositeOperation = "destination-out";
      ct.drawImage(can1, 0, 0, w, h);
      ct.globalCompositeOperation = "source-out";
      ct.shadowColor = "black";
      ct.shadowBlur = this.blur;
      if (this.tune){
        ct.filter = 'blur('+this.blur+'px)';
      }
      
      ct.shadowOffsetX = x;
      ct.shadowOffsetY = y;
      ct.drawImage(can1, 0, 0, w, h);
      ct.globalCompositeOperation = "source-in";
      ct.shadowColor = "transparent";
      ct.fillStyle = this.light; /// change
      ct.fillRect(0, 0, w, h);

      ctxOrg.globalCompositeOperation = 'lighter'; //change
      ctxOrg.drawImage(can, 0, 0);
      var imageData = ctxOrg.getImageData(0, 0, w, h);
      options.imageData = imageData;
  },

  applyTo2d: function (options) {



    var h = options.imageData.height;
    var w = options.imageData.width;
    var tune = this.tune?'in':'over';
    var invert = this.invert?'250':'-250';
    var light = this.light || '#ffffff';
    var blur = this.blur || 1;
    var embossed = this.embossed || 1;
    var d = new Date();
    console.log(d.getMinutes(),d.getSeconds() ,d.getMilliseconds());
    var canvas1 = fabric.util.createCanvasElement();
    canvas1.width = w;
    canvas1.height = h;
    var ctx = canvas1.getContext('2d');
    ctx.putImageData(options.imageData, 0, 0);
 
    
    var el = document.getElementById('svgfilter');
    if (el) el.remove(); 
    window.document.body.insertAdjacentHTML('afterbegin', `<svg id="svgfilter"><filter id="filter">
    <feGaussianBlur stdDeviation="${embossed}"  in="SourceGraphic" result="blur2"/>
    <feSpecularLighting surfaceScale="${blur}" specularConstant="1" specularExponent="30" lighting-color="${light}"  in="blur2" result="specularLighting">
   <feDistantLight azimuth="${invert}" elevation="50"/></feSpecularLighting>
     <feComposite in="SourceGraphic" in2="specularLighting" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"  result="composite1"/>
    <feComposite in="composite1" in2="SourceGraphic" operator="${tune}"  result="composite2"/>
    </filter></svg>
    `);

    
    ctx.filter = 'url(#filter)';
    ctx.drawImage(canvas1, 0, 0,);

    el = document.getElementById('svgfilter');
    if (el) el.remove();



    // ctxOrg.drawImage(can, 0, 0);
    var imageData = ctx.getImageData(0, 0, w, h);
    options.imageData = imageData;
    d = new Date();
    console.log(d.getMinutes(),d.getSeconds() ,d.getMilliseconds());
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
        light: this.light,
        shadow: this.shadow,
        embossed: this.embossed,
        invert: this.invert,
        blur: this.blur,
        tune: this.tune,
      };
      if(this.angle){
        ob['angle'] = this.angle
      }
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
  fabric.Image.filters.Embossed.fromObject = fabric.Image.filters.BaseFilter.fromObject;
  // fabric.Image.filters.Outline.fromObject = function(object, callback) {
  //   fabric.Image.fromObject(object.image, function(image) {
  //     var options = fabric.util.object.clone(object);
  //     options.image = image;
  //     callback(new fabric.Image.filters.Outline(options));
  //   });
  // };
})(typeof exports !== 'undefined' ? exports : this);
