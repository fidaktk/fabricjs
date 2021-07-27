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
    inset: false,
    canvases: [],
    applyTo2d11: function (options) {
      if (this.width === 0 && this.blur === 0) {
        // early return if the parameter value has a neutral value
        return;
      }
      // console.log(options);
      var imageData = options.imageData, data = imageData.data, i, len = data.length;

      // var transData = this.createOutlineMask(imageData,0xC0);
      // console.log(points);
      var ratio = options.sourceWidth + options.sourceHeight + parseFloat(this.width) * parseFloat(this.blur);
      var width = options.sourceWidth + ratio;
      var height = options.sourceHeight + ratio;
      var canvas1 = fabric.util.createCanvasElement();
      canvas1.width = width;
      canvas1.height = height;
      var offx, offy;
      offx = offy = ratio / 2;
      var ctx = canvas1.getContext('2d');
      var s = 6, x = 25, y = 25;
      // ctx.globalCompositeOperation = 'destination-over';
      // ctx.shadowColor = this.color;
      // ctx.shadowBlur = parseFloat(this.blur);
      // for (var xx = -this.width; xx <= this.width; xx++) {
      //   for (var yy = -this.width; yy <= this.width; yy++) {
      //     // ctx.shadowOffsetX = xx;
      //     // ctx.shadowOffsetY = yy;
      //     // console.log(xx,yy)
      //     ctx.filter = 'drop-shadow(' + xx + 'px ' + yy + 'px ' + this.blur + 'px ' + this.color + ')';
      //     ctx.drawImage(options.originalEl, xx, yy);
      //   }

      // }
      ctx.filter = 'blur(15px)';
      for (i = 0; i < 360; i++) {
        ctx.drawImage(options.originalEl, x + Math.sin(i) * s, y + Math.cos(i) * s);
      }

      // ctx.globalCompositeOperation = "source-in";

      // ctx.filter = 'invert(100)';
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(options.originalEl, x, y);

      // ctx.putImageData(imageData, offx, offy);
      var trimmedCanvas = this.trimCanvas(canvas1);
      // console.log(trimmedCanvas);
      options.imageData = trimmedCanvas.getContext('2d').getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
    },

    applyTo2d: function (options) {
      if (this.width === 0 && this.blur === 0) {
        // early return if the parameter value has a neutral value
        return;
      }
      // console.log(options);
      var imageData = options.imageData, data = imageData.data, i, len = data.length;

      // var transData = this.createOutlineMask(imageData,0xC0);
      // console.log(points);

      console.log(new Date().getMilliseconds());
      // var points = this.getOutline(data, options.sourceWidth, options.sourceHeight);
      // console.log(points);
      // console.log(points, new Date().getMilliseconds());
      // var ratio =  (options.sourceWidth + options.sourceHeight + parseFloat(this.width) * parseFloat(this.blur)) *2;

      var ratio = (parseFloat(this.width) * 2) + (this.blur * 2) * 5;// (options.sourceWidth + options.sourceHeight + parseFloat(this.width) * parseFloat(this.blur)) *2;
      var width = options.sourceWidth + ratio * 2;
      var height = options.sourceHeight + ratio * 2;
      var canvas1 = fabric.util.createCanvasElement();
      canvas1.width = width;
      canvas1.height = height;
      var offx, offy;
      offx = offy = ratio / 2;
      var ctx = canvas1.getContext('2d');
      ctx.shadowColor = this.color;
      var dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1], // offset array
        s = this.width,  // thickness scale
        i = 0;  // iterator
      // x = offx,  // final position
      // y = offy;
      // ctx.shadowOffsetX=offy;

      // for(; i < dArr.length; i += 1){
      //   ctx.shadowBlur = this.blur;
      //   // ctx.drawImage(options.canvasEl, x + dArr[i]*s, y + dArr[i+1]*s);
      //   ctx.drawImage(options.canvasEl, x, y);

      // }
      ctx.save();

      ctx.filter = 'blur(' + this.blur + 'px)';
      for (i = 0; i < 360; i += 20) {
        ctx.drawImage(options.canvasEl, offx + Math.sin(i) * this.width, offy + Math.cos(i) * this.width);
      }



      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = this.color;

      // ctx.shadowBlur = s;
      // for (var i = 0; i < 10; i++) {
      //   ctx.shadowBlur = i * 2;
      // ctx.drawImage(options.canvasEl, x, y);
      // ctx.strokeRect(-270, 30, 75, 150);
      ctx.fillRect(0, 0,width, height);
      // }
      // ctx.fillRect(0,0, canvas1.width, canvas1.height);
      // ctx.filter = 'blur(50px)';
      // ctx.globalCompositeOperation = "source-over";
      // ctx.save();
      // ctx.strokeStyle = this.color;
      // ctx.shadowColor = this.color;
      // ctx.shadowOffsetX=300;
      // for (var i = 0; i < 10; i++) {
      //     ctx.shadowBlur = i * 2;
      //     ctx.drawImage(options.canvasEl, x, y);
      //     // ctx.strokeRect(-270, 30, 75, 150);
      // }
      ctx.restore();
      // ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(options.canvasEl, offy, offy);
      console.log(new Date().getMilliseconds());
      // ctx.globalCompositeOperation = 'source-over';
      // ctx.putImageData(imageData, offx, offy);
      // if (this.inset) { ctx.globalCompositeOperation = 'source-atop'; }
      // ctx.strokeStyle = this.color;
      // ctx.lineWidth = parseFloat(this.width);
      // ctx.shadowColor = this.color;
      // ctx.shadowBlur = parseFloat(this.blur);
      // if (!this.inset) { ctx.globalCompositeOperation = 'destination-over'; }
      // // ctx.globalCompositeOperation = 'multiply';

      // // this.blur
      // for (var i = 0; i < this.blur + 1; i++) {
      //   ctx.shadowBlur = i * parseFloat(this.blur);
      //   if (points.length) this.drawOutline(points, offx, offy, ctx);
      // }

      // if (points.length) this.drawOutline(points, offx, offy, ctx);

      // ctx.globalCompositeOperation = 'multiply';
      // ctx.putImageData(imageData, offx, offy);
      // options.canvasEl.width = width;
      var trimmedCanvas = this.trimCanvas(canvas1);

      // var offset =   parseFloat(this.width);
      // var blur =   255 - parseFloat(this.blur);
      // var width = options.sourceWidth + offset + offset *  parseFloat(this.blur);
      // var height = options.sourceHeight + offset + offset *  parseFloat(this.blur);
      // var canvas1 = fabric.util.createCanvasElement();
      // canvas1.width = width;
      // canvas1.height = height;
      // var offx, offy;
      // offx = offy = offset / 2;
      // var ctx = canvas1.getContext('2d');
      // ctx.save();

      // ctx.filter = 'drop-shadow(0px 0px ' + offset + 'px ' + this.color + ' ) ';

      // ctx.drawImage(options.canvasEl,offset,offset);
      // ctx.globalCompositeOperation = 'destination-over';

      // this.normalizeAlphaShadow(canvas1,blur);

      // ctx.restore();

      // var trimmedCanvas = this.trimCanvas(canvas1);
      // console.log(trimmedCanvas);
      options.canvasEl = trimmedCanvas;
      options.imageData = trimmedCanvas.getContext('2d').getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
    },

    // getOutline: function (data, w, h) {
    //   // var imageData = ctx.getImageData(pointX, pointY, w, h);
    //   // var data = imageData.data;
    //   var outline = [];
    //   for (var x = 0; x < w; x++) {
    //     for (var y = 0; y < h; y++) {
    //       var index = (x + y * w) * 4;

    //       var nextIndex, lastIndex, leftIndex, rightIndex;
    //       nextIndex = (x + (y + 1) * w) * 4;
    //       lastIndex = (x + (y - 1) * w) * 4;
    //       leftIndex = index - 4;
    //       rightIndex = index + 4;
    //       var cx = [x,y];
    //       // var cx = { "X": x, "Y": y };
    //       if (data[index + 3] !== 0 &&
    //         ((data[nextIndex + 3] === 0)
    //           || (data[lastIndex + 3] === 0)
    //           || (data[leftIndex + 3] === 0)
    //           || (data[rightIndex + 3] === 0)
    //         )
    //       ) {
    //         outline.push(cx);
    //       }
    //     }
    //   }
    //   return outline;
    // },

    //     applyTo2d1: function (options) {
    //       if (this.width === 0 && this.blur === 0) {
    //         // early return if the parameter value has a neutral value
    //         return;
    //       }
    //       // console.log(options);
    //       var imageData = options.imageData, data = imageData.data, i, len = data.length;

    //       // var transData = this.createOutlineMask(imageData,0xC0);
    //       // console.log(points);
    //       var offset =   parseFloat(this.width);
    //       var blur =   255 - parseFloat(this.blur);
    //       var width = options.sourceWidth + offset + offset *  parseFloat(this.blur);
    //       var height = options.sourceHeight + offset + offset *  parseFloat(this.blur);
    //       var canvas1 = fabric.util.createCanvasElement();
    //       canvas1.width = width;
    //       canvas1.height = height;
    //       var offx, offy;
    //       offx = offy = offset / 2;
    //       var ctx = canvas1.getContext('2d');
    //       ctx.save();
    //       // ctx.fillStyle = '#000000';
    //       // ctx.fillRect(0,0,width,height);
    //       // ctx.putImageData(options.imageData,offset,offset);
    //       //then I use the image to make an hole in it
    //       // ctx.globalCompositeOperation = 'destination-over';

    //       // ctx.drawImage(options.originalEl,offset,offset);

    //       ctx.filter = 'drop-shadow(0px 0px ' + offset + 'px ' + this.color + ' ) ';
    // // ctx.filter = 'blur(50px)';
    //       ctx.drawImage(options.canvasEl,offset,offset);
    //       ctx.globalCompositeOperation = 'destination-over';


    //       ///

    //       // var shadow = document.createElement('canvas');
    //       // var shadowContext = shadow.getContext('2d');
    //       // shadow.width = options.imageData.width;
    //       // shadow.height = options.imageData.height;
    //       // shadowContext.filter = 'drop-shadow(0px 0px ' + offset + 'px #FFF000 ) ';
    //       // shadowContext.drawImage(canvas1,-offset,-offset);
    //       // shadowContext.globalCompositeOperation = 'destination-out';
    //       // shadowContext.drawImage(canvas1,-offset,-offset);

    //       // this.normalizeAlphaShadow(shadow,2);

    //       ctx.restore();
    //       this.normalizeAlphaShadow(canvas1,blur);
    //       // var result = document.createElement('canvas');
    //       // result.width = width;
    //       // result.height = height;
    //       // var context = result.getContext('2d');
    //       // context.drawImage(options.originalEl,0,0);
    //       // context.drawImage(shadow,0,0);

    //       var trimmedCanvas = this.trimCanvas(canvas1);
    //       // console.log(trimmedCanvas);
    //       options.canvasEl = trimmedCanvas;
    //       options.imageData = trimmedCanvas.getContext('2d').getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
    //     },
    // normalizeAlphaShadow: function (canvas, alpha) {
    //   // var imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    //   // var pixelData = imageData.data;
    //   // var i, len = pixelData.length;
    //   // var max = 0;
    //   // for (i = 3; i < len; i += 4) { if (pixelData[i] > max) { max = pixelData[i]; } }

    //   // max = (255 / max) * alpha;
    //   // for (i = 3; i < len; i += 4) { pixelData[i] *= max; }

    //   // canvas.getContext('2d').putImageData(imageData, 0, 0);
    //   var imageData = canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height);
    //   var pixelData = imageData.data;
    //   var i,len = pixelData.length;
    //   var max = 0;
    //   for(i=3;i<len;i+=4) if(pixelData[i]>max) max = pixelData[i];

    //   max = (255/max) * alpha;
    //   for(i=3;i<len;i+=4) pixelData[i] *= max;

    //   canvas.getContext("2d").putImageData(imageData,0,0)

    // },
    // applyTo2d2: function (options) {
    //   // console.log(options);
    //   if (this.width === 0 && this.blur === 0) {
    //     // early return if the parameter value has a neutral value
    //     return;
    //   }
    //   console.log(new Date().getMilliseconds());
    //   var imageData = options.imageData, data = imageData.data, i, len = data.length;
    //   var geom = {};
    //   geom.contour = function (o, r) { var t = r || d3_geom_contourStart(o), n = [], u = t[0], _ = t[1], e = 0, a = 0, c = NaN, g = NaN, m = 0; do { m = 0, o(u - 1, _ - 1) && (m += 1), o(u, _ - 1) && (m += 2), o(u - 1, _) && (m += 4), o(u, _) && (m += 8), 6 === m ? (e = -1 === g ? -1 : 1, a = 0) : 9 === m ? (e = 0, a = 1 === c ? -1 : 1) : (e = d3_geom_contourDx[m], a = d3_geom_contourDy[m]), e != c && a != g && (n.push([u, _]), c = e, g = a), u += e, _ += a; } while (t[0] != u || t[1] != _); return n; }; var d3_geom_contourDx = [1, 0, 1, 1, -1, 0, -1, 1, 0, 0, 0, 0, -1, 0, -1, NaN], d3_geom_contourDy = [0, -1, 0, 0, 0, -1, 0, 0, 1, -1, 1, 1, 0, -1, 0, NaN]; function d3_geom_contourStart(o) { for (var r = 0, t = 0; ;) { if (o(r, t)) { return [r, t]; } 0 === r ? (r = t + 1, t = 0) : (r -= 1, t += 1); } }
    //   var defineNonTransparent = function (x, y) {
    //     var a = data[(y * imageData.width + x) * 4 + 3];
    //     return (a > 20);
    //   }
    //   var points = geom.contour(defineNonTransparent);

    //   // var points = geom.contour(function (x, y) {
    //   //   // console.log(data[(y * imageData.width + x) * 4 + 3] > 50)
    //   //   // return (data[(y * imageData.width + x) * 4 + 3] > 1);
    //   //   var a=data[(y * imageData.width + x) * 4 + 3];
    //   //   return(a>20);
    //   //   // return (a > 20);
    //   // });
    //   // var points = this.getPoints(data, options.sourceWidth,  options.sourceHeight);
    //   // var points = this.createOutlineMask(imageData, 0xC0);

    //   // console.log(new Date());
    //   console.log(points, new Date().getMilliseconds());
    //   var ratio = options.sourceWidth + options.sourceHeight + parseFloat(this.width) * parseFloat(this.blur);
    //   var width = options.sourceWidth + ratio;
    //   var height = options.sourceHeight + ratio;
    //   var canvas1 = fabric.util.createCanvasElement();
    //   canvas1.width = width;
    //   canvas1.height = height;
    //   var offx, offy;
    //   offx = offy = ratio / 2;
    //   var ctx = canvas1.getContext('2d');
    //   ctx.globalCompositeOperation = 'source-over';
    //   ctx.putImageData(imageData, offx, offy);
    //   if (this.inset) { ctx.globalCompositeOperation = 'source-atop'; }
    //   ctx.strokeStyle = this.color;
    //   ctx.lineWidth = parseFloat(this.width);
    //   ctx.shadowColor = this.color;
    //   ctx.shadowBlur = parseFloat(this.blur);
    //   if (!this.inset) { ctx.globalCompositeOperation = 'destination-over'; }
    //   // ctx.globalCompositeOperation = 'multiply';

    //   // this.blur
    //   for (var i = 0; i < this.blur + 1; i++) {
    //     ctx.shadowBlur = i * parseFloat(this.blur);
    //     if (points.length) this.drawOutline(points, offx, offy, ctx);
    //   }

    //   if (points.length) this.drawOutline(points, offx, offy, ctx);

    //   // ctx.globalCompositeOperation = 'multiply';
    //   // ctx.putImageData(imageData, offx, offy);
    //   // options.canvasEl.width = width;
    //   var trimmedCanvas = this.trimCanvas(canvas1);
    //   // console.log(trimmedCanvas);
    //   options.imageData = trimmedCanvas.getContext('2d').getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
    // },

    // drawOutline: function (points, offsetX, offsetY, ctx) {
    //   // draw results
    //   ctx.beginPath();
    //   ctx.moveTo(points[0][0] + offsetX, points[0][1] + offsetY);
    //   for (var i = 1; i < points.length; i++) {
    //     var point = points[i];
    //     ctx.lineTo(point[0] + offsetX, point[1] + offsetY);
    //   }
    //   ctx.closePath();
    //   ctx.stroke();
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
