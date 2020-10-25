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
    color: '#FFFFFF',
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
    applyTo2d33: function (options) {
      if (this.width === 0 && this.blur === 0) {
        // early return if the parameter value has a neutral value
        return;
      }
      // console.log(options);
      var imageData = options.imageData, data = imageData.data, i, len = data.length;

      // var transData = this.createOutlineMask(imageData,0xC0);
      // console.log(points);
      var ratio = options.sourceWidth + options.sourceHeight +  parseFloat(this.width) *  parseFloat(this.blur);
      var width = options.sourceWidth + ratio;
      var height = options.sourceHeight + ratio;
      var canvas1 = fabric.util.createCanvasElement();
      canvas1.width = width;
      canvas1.height = height;
      var offx, offy;
      offx = offy = ratio / 2;
      var ctx = canvas1.getContext('2d');
      // ctx.globalCompositeOperation = 'destination-over';
      // ctx.shadowColor = this.color;
      // ctx.shadowBlur = parseFloat(this.blur);
      for (var xx = -this.width; xx <= this.width; xx++) {
        for (var yy = -this.width; yy <= this.width; yy++) {
          // ctx.shadowOffsetX = xx;
          // ctx.shadowOffsetY = yy;
          // console.log(xx,yy)
          ctx.filter = 'drop-shadow(' + xx + 'px ' + yy + 'px ' + this.blur + 'px ' + this.color + ')';
          ctx.drawImage(options.originalEl, xx, yy);
        }

      }

      var trimmedCanvas = this.trimCanvas(canvas1);
      // console.log(trimmedCanvas);
      options.imageData = trimmedCanvas.getContext('2d').getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
    },
    applyTo2dS: function (options) {
      if (this.width === 0 && this.blur === 0) {
        // early return if the parameter value has a neutral value
        return;
      }
      // console.log(options);
      var imageData = options.imageData, data = imageData.data, i, len = data.length;

      // var transData = this.createOutlineMask(imageData,0xC0);
      // console.log(points);
      var offset =   parseFloat(this.width);
      var blur =   255 - parseFloat(this.blur);
      var width = options.sourceWidth + offset + offset *  parseFloat(this.blur);
      var height = options.sourceHeight + offset + offset *  parseFloat(this.blur);
      var canvas1 = fabric.util.createCanvasElement();
      canvas1.width = width;
      canvas1.height = height;
      var offx, offy;
      offx = offy = offset / 2;
      var ctx = canvas1.getContext('2d');
      ctx.save();
      // ctx.fillStyle = '#000000';
      // ctx.fillRect(0,0,width,height);
      // ctx.putImageData(options.imageData,offset,offset);
      //then I use the image to make an hole in it
      // ctx.globalCompositeOperation = 'destination-over';

      // ctx.drawImage(options.originalEl,offset,offset);
      ctx.filter = 'drop-shadow(0px 0px ' + offset + 'px ' + this.color + ' ) ';

      ctx.drawImage(options.canvasEl,offset,offset);
      ctx.globalCompositeOperation = 'destination-over';

      this.normalizeAlphaShadow(canvas1,blur);
      ///

      // var shadow = document.createElement('canvas');
      // var shadowContext = shadow.getContext('2d');
      // shadow.width = options.imageData.width;
      // shadow.height = options.imageData.height;
      // shadowContext.filter = 'drop-shadow(0px 0px ' + offset + 'px #FFF000 ) ';
      // shadowContext.drawImage(canvas1,-offset,-offset);
      // shadowContext.globalCompositeOperation = 'destination-out';
      // shadowContext.drawImage(canvas1,-offset,-offset);

      // this.normalizeAlphaShadow(shadow,2);

      ctx.restore();
      // var result = document.createElement('canvas');
      // result.width = width;
      // result.height = height;
      // var context = result.getContext('2d');
      // context.drawImage(options.originalEl,0,0);
      // context.drawImage(shadow,0,0);

      var trimmedCanvas = this.trimCanvas(canvas1);
      // console.log(trimmedCanvas);
      options.canvasEl = trimmedCanvas;
      options.imageData = trimmedCanvas.getContext('2d').getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
    },
    normalizeAlphaShadow: function (canvas,alpha){
      var imageData = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
      var pixelData = imageData.data;
      var i,len = pixelData.length;
      var max = 0;
      for (i = 3;i < len;i += 4) {if (pixelData[i] > max) {max = pixelData[i];}}

      max = (255 / max) * alpha;
      for (i = 3;i < len;i += 4) {pixelData[i] *= max;}

      canvas.getContext('2d').putImageData(imageData,0,0);

    },
    applyTo2d222: function (options) {
      if (this.width === 0 && this.blur === 0) {
        // early return if the parameter value has a neutral value
        return;
      }
      // console.log(options);
      var imageData = options.imageData, data = imageData.data, i, len = data.length;
      var geom = {};
      geom.contour = function (o, r) { var t = r || d3_geom_contourStart(o), n = [], u = t[0], _ = t[1], e = 0, a = 0, c = NaN, g = NaN, m = 0; do { m = 0, o(u - 1, _ - 1) && (m += 1), o(u, _ - 1) && (m += 2), o(u - 1, _) && (m += 4), o(u, _) && (m += 8), 6 === m ? (e = -1 === g ? -1 : 1, a = 0) : 9 === m ? (e = 0, a = 1 === c ? -1 : 1) : (e = d3_geom_contourDx[m], a = d3_geom_contourDy[m]), e != c && a != g && (n.push([u, _]), c = e, g = a), u += e, _ += a; } while (t[0] != u || t[1] != _); return n; }; var d3_geom_contourDx = [1, 0, 1, 1, -1, 0, -1, 1, 0, 0, 0, 0, -1, 0, -1, NaN], d3_geom_contourDy = [0, -1, 0, 0, 0, -1, 0, 0, 1, -1, 1, 1, 0, -1, 0, NaN]; function d3_geom_contourStart(o) { for (var r = 0, t = 0; ;) { if (o(r, t)) { return [r, t]; } 0 === r ? (r = t + 1, t = 0) : (r -= 1, t += 1); } }
      var points = geom.contour(function (x, y) {
        return (data[(y * imageData.width + x) * 4 + 3] > 50);
        // return (a > 20);
      });
      // var points = this.getPoints(data, options.sourceWidth,  options.sourceHeight);
      // var points = this.createOutlineMask(imageData, 0xC0);


      // console.log(points);
      var ratio = options.sourceWidth + options.sourceHeight +  parseFloat(this.width) *  parseFloat(this.blur);
      var width = options.sourceWidth + ratio;
      var height = options.sourceHeight + ratio;
      var canvas1 = fabric.util.createCanvasElement();
      canvas1.width = width;
      canvas1.height = height;
      var offx, offy;
      offx = offy = ratio / 2;
      var ctx = canvas1.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      ctx.putImageData(imageData, offx, offy);
      if (this.inset) {ctx.globalCompositeOperation = 'source-atop';}
      ctx.strokeStyle = this.color;
      ctx.lineWidth = parseFloat(this.width);
      ctx.shadowColor = this.color;
      ctx.shadowBlur = parseFloat(this.blur);
      if (!this.inset) {ctx.globalCompositeOperation = 'destination-over';}
      // ctx.globalCompositeOperation = 'multiply';


      for (var i = 0; i < this.blur + 1; i++) {
        ctx.shadowBlur = i * parseFloat(this.blur);
        this.drawOutline(points, offx, offy, ctx);
      }

      this.drawOutline(points, offx, offy, ctx);
      // ctx.globalCompositeOperation = 'multiply';
      // ctx.putImageData(imageData, offx, offy);
      // options.canvasEl.width = width;
      var trimmedCanvas = this.trimCanvas(canvas1);
      console.log(trimmedCanvas);
      options.imageData = trimmedCanvas.getContext('2d').getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
    },

    drawOutline: function (points, offsetX, offsetY, ctx) {
      // draw results
      ctx.beginPath();
      ctx.moveTo(points[0][0] + offsetX, points[0][1] + offsetY);
      for (var i = 1; i < points.length; i++) {
        var point = points[i];
        ctx.lineTo(point[0] + offsetX, point[1] + offsetY);
      }
      ctx.closePath();
      ctx.stroke();
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
    getPoints: function (data,w,h){
      // var imageData = ctx.getImageData(pointX, pointY, w, h);
      // var data = imageData.data;
      var outline = [];
      for (var x = 0;x < w;x++){
        for (var y = 0;y < h;y++){
          var index = (x + y * w) * 4;

          var nextIndex, lastIndex, leftIndex, rightIndex;
          nextIndex = (x + (y + 1) * w ) * 4;
          lastIndex = (x + (y - 1) * w ) * 4;
          leftIndex = index - 4;
          rightIndex = index + 4;

          var cx = {X: x,Y: y};
          if (data[index + 3] !== 0 &&
                  ( (data[nextIndex + 3] === 0)
                      || ( data[lastIndex + 3] === 0)
                      || ( data[leftIndex + 3] === 0)
                      || ( data[rightIndex + 3] === 0)
                  )
          ){
            outline.push(cx);
          }
        }
      }
      return outline;
    },
    applyTo2d: function (options) {
      var imageData = options.imageData;
      var data = imageData.data.slice();
      var h = imageData.height, w = imageData.width;
      var alpha = 100;
      var color = [0,0,255,255];
      var color2 = [0,0,255,255];
      var p,np,dp,up;

      for (var i = 0; i < data.length; i += 4) {
        p = data[i + 3];
        np = data[i + 3 + 4];
        dp = data[i + 3 + 4 + w];
        up = data[i + 3 + 4 - w];

        // console.log(p,np);
        // var dp =  data[i + 3];

        if (alpha > p && alpha < np) {changeData(i, color); }
        if (p > alpha && np < alpha) {changeData(i + 4, color2);}

        if (p > alpha && dp < alpha) {changeData(i + w, color2);}

        // if (data[i + 3] > alpha && data[i + 7] < alpha) {
        //   changeData(i + 4, color2);
        // }

      }

      function changeData(offset,value){
        options.imageData.data[offset + 0] = value[0];
        options.imageData.data[offset + 1] = value[1];
        options.imageData.data[offset + 2] = value[2];
        options.imageData.data[offset + 3] = value[3];
      }
      // var outlineMask = this.createOutlineMask(options.imageData, 0xC0);
      // var ants = this.renderMarchingAnts(options.imageData, outlineMask, 0);
      // console.log(ants);
      // options.imageData = ants;
    },
    ant: function (x, y, offset) {
      // return ((6 + y + offset % 12) + x) % 12 > 111 ? 0x00 : 0xFF;//((6 + y + offset % 12) + x) % 12 > 1 ? 0x00 : 0xFF;
      // (data[(y * imageData.width + x) * 4 + 3] > 50);
      return 0;
    },
    renderMarchingAnts: function (imageData, outlineMask, antOffset) {
      var data = imageData.data;
      var w = imageData.width, h = imageData.height;
      var outline = outlineMask.data;

      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var offset = ((y * w) + x) * 4;
          var isEdge = outline[offset] === 0;
          // console.log(value);

          // changeData(offset + w * 4, [255,value,value,255]);
          if (isEdge) {
            // var value = this.ant(x, y, antOffset);
            // data[offset + 0] = value;
            // data[offset + 1] = value;
            // data[offset + 2] = value;
            // data[offset + 3] = 255;
            changeData(offset, [0,0,255,255]);
            changeData(offset - 4, [0,0,255,255]);
            changeData(offset - 8, [0,255,255,255]);
            changeData(offset - 12, [255,0,255,255]);
            changeData(offset - 16, [255,0,0 ,255]);
            changeData(offset - 16, [255,0,0 ,255]);
            // changeData(offset - 4, [0,255,0,255]);
            // for(var n = 0; n >= 8; n++){
            //   changeData(offset+w*4, [value,value,value,255]);
            // }
            // offset = offset+w*4;
            // changeData(offset - w * 4, [0,0,255,100]);

            // changeData(offset - 4, [value,value,value,100]);
            // changeData(offset + 4, [value,value,value,100]);


            // var n=((width*y)+x)*4;
            // data[n]=255;
            // data[n+1]=0;
            // data[n+2]=0;
            // data[n+3]=255;
            // // if(x>width/2){
            // //     data[n+3]=255*(1-((x-width/2)/(width/2)));
            // // }

          }
          else {
            // data[offset + 0] = 122;
            // data[offset + 1] = 12;
            // data[offset + 2] = 42;
            // changeData(offset-w*4, [0,0,255,100]);
            changeData(offset, [0,0,0,0]);
            // data[offset + 3] = 0;
          }
        }
      }
      function changeData(offset,value){
        data[offset + 0] = value[0];
        data[offset + 1] = value[1];
        data[offset + 2] = value[2];
        data[offset + 3] = value[3];
      }

      return imageData;
    },
    createOutlineMask: function (srcImageData, threshold) {
      var srcData = srcImageData.data;
      var width = srcImageData.width, height = srcImageData.height;

      function get(x, y) {
        if (x < 0 || x >= width || y < 0 || y >= height) {return;};
        var offset = ((y * width) + x) * 4;
        return srcData[offset + 3];
      }
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;

      // var context = this.createContext(width, height);
      var dstImageData = context.getImageData(0, 0, width, height);
      var dstData = dstImageData.data;

      function set(x, y, value) {
        var offset = ((y * width) + x) * 4;
        dstData[offset + 0] = value;
        dstData[offset + 1] = value;
        dstData[offset + 2] = value;
        dstData[offset + 3] = 0xFF;
      }

      function match(x, y) {
        var alpha = get(x, y);
        return alpha === null || alpha >= threshold;
      }

      function isEdge(x, y) {
        return !match(x - 1, y - 1) || !match(x + 0, y - 1) || !match(x + 1, y - 1) ||
               !match(x - 1, y + 0) ||      false       || !match(x + 1, y + 0) ||
               !match(x - 1, y + 1) || !match(x + 0, y + 1) || !match(x + 1, y + 1);
      }

      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          if (match(x, y) && isEdge(x, y)) {
            set(x, y, 0x00);
          }
          else {
            set(x, y, 0xFF);
          }
        }
      }

      return dstImageData;
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
