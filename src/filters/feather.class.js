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
  filters.Feather = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.Outline.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'Feather',

    from: 0, 
    to: 0,
    feather: '',
    edges: {
      top: false,
      right: false,
      left: false,
      bottom: false
    },
    circle: {
      x: 100,
      y: 100
  },
    invert: false,
    mainParameter: 'feather',

    applyTo2d: function (options) {
      if ((this.from == 0 && this.to == 0) || (this.from >100 && this.to >100)) {
        // early return if the parameter value has a neutral value
        return;
      }
      var f = parseFloat(this.from / 100);
      var t = parseFloat(this.to / 100);
      var w = options.imageData.width;
      var h = options.imageData.height;
      var can = fabric.util.createCanvasElement();
      can.width = w;
      can.height = h;
      var ctx = can.getContext('2d');
      ctx.putImageData(options.imageData, 0, 0);


      var i = 1;
      
      if(this.invert){
        [f, t] = [t, f];
      }
      fabric.log(f, t);
      // ctx.save();
      if (this.feather === 'edges') {
        ctx.globalCompositeOperation = "destination-out";
        if(this.edges.left){
        var grd1 = ctx.createLinearGradient(0, 0, w, 0);
        grd1.addColorStop(t, "rgba(0,0,0,0");
        grd1.addColorStop(f, "black");
        ctx.fillStyle = grd1;
        ctx.fillRect(0, 0, w, h);
        }

        if(this.edges.top){
        var grd2 = ctx.createLinearGradient(0, 0, 0, h);
        grd2.addColorStop(t, "rgba(0,0,0,0");
        grd2.addColorStop(f, "black");
        ctx.fillStyle = grd2;
        ctx.fillRect(0, 0, w, h);
        }
        if(this.edges.bottom){
        var grd3 = ctx.createLinearGradient(0, h, 0, 0);
        grd3.addColorStop(t, "rgba(0,0,0,0");
        grd3.addColorStop(f, "black");
        ctx.fillStyle = grd3;
        ctx.fillRect(0, 0, w, h);
        }
        if(this.edges.right){
        var grd4 = ctx.createLinearGradient(w, 0, 0, 0);
        grd4.addColorStop(t, "rgba(0,0,0,0");
        grd4.addColorStop(f, "black");
        ctx.fillStyle = grd4;
        ctx.fillRect(0, 0, w, h);
        }
      }

      if(this.feather === 'circle'){
        ctx.globalCompositeOperation = "destination-out";
        var x = (w/100)*this.circle.x;
        var y = (h/100)*this.circle.y;
        var s = w>h?h:w;
        // var r = (s/100)*this.circle.r;
        var grd1 = ctx.createRadialGradient(x, y, 0, x, y, s);
        grd1.addColorStop(f, "rgba(0,0,0,0");
        grd1.addColorStop(t, "black");
        ctx.fillStyle = grd1;
        ctx.fillRect(0, 0, w, h);
      }


      // ctx.globalCompositeOperation = "source-out";
      // ctx.drawImage(options.canvasEl, 0, 0, w, h);


      var imageData = ctx.getImageData(0, 0,w,h);
      options.imageData = imageData;
      // var trimmedCanvas = can; //sthis.trimCanvas(can);
      // options.ctx.drawImage(options.canvasEl, 0, 0);
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

    toObject: function() {
      var ob = {
        width: this.width,
        blur: this.blur,
        from: this.from,
        to: this.to,
        feather: this.feather,
        invert: this.invert,
      };
      if(this.feather == 'edges'){
        ob['edges'] = this.edges
      }else{
        ob['circle'] = this.circle
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
  fabric.Image.filters.Feather.fromObject = fabric.Image.filters.BaseFilter.fromObject;
  // fabric.Image.filters.Outline.fromObject = function(object, callback) {
  //   fabric.Image.fromObject(object.image, function(image) {
  //     var options = fabric.util.object.clone(object);
  //     options.image = image;
  //     callback(new fabric.Image.filters.Outline(options));
  //   });
  // };
})(typeof exports !== 'undefined' ? exports : this);
