(function (global) {
  'use strict';

  var fabric = global.fabric,
    filters = fabric.Image.filters,
    createClass = fabric.util.createClass;

  /**
   * Image Blend filter class
   * @class fabric.Image.filter.BlendImage
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @example
   * var filter = new fabric.Image.filters.BlendColor({
   *  color: '#000',
   *  mode: 'multiply'
   * });
   *
   * var filter = new fabric.Image.filters.BlendImage({
   *  image: fabricImageObject,
   *  mode: 'multiply',
   *  alpha: 0.5
   * });
   * object.filters.push(filter);
   * object.applyFilters();
   * canvas.renderAll();
   */

  filters.Mask = createClass(filters.BaseFilter, /** @lends fabric.Image.filters.BlendImage.prototype */ {
    type: 'Mask',
    mask: null,
    channel: 0,
    invert: false,


    applyTo2d: function (options) {
      if (!this.mask) return;
      var w = options.imageData.width;
      var h = options.imageData.height;
      var canvas = fabric.util.createCanvasElement();
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.putImageData(options.imageData, 0, 0);


      var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        maskEl = this.mask._originalElement,
        maskCanvasEl = fabric.util.createCanvasElement(),
        channel = this.channel,
        i;
      maskCanvasEl.width = maskEl.width;
      maskCanvasEl.height = maskEl.height;
      maskCanvasEl.getContext('2d').drawImage(maskEl, 0, 0, maskEl.width, maskEl.height);
      var maskImageData = maskCanvasEl.getContext('2d').getImageData(0, 0, maskEl.width, maskEl.height),
        maskData = maskImageData.data;
      for (i = 0; i < imageData.width * imageData.height * 4; i += 4) {
        data[i + 3] = maskData[i + channel];
      }
      context.putImageData(imageData, 0, 0);








      // var imageData = options.imageData,
      //   resources = options.filterBackend.resources,
      //   data = imageData.data, iLen = data.length,
      //   width = imageData.width,
      //   height = imageData.height,
      //   tr, tg, tb, ta,
      //   r, g, b, a,
      //   canvas1, context, image = this.image, blendData;
      // var threshold = 140.418;
      // var mask = this.backgroundMask(imageData, threshold);
      // if (mask) {
      //   // Erode
      //   mask = this.erodeMask(mask, imageData.width, imageData.height);

      //   // Dilate
      //   mask = this.dilateMask(mask, imageData.width, imageData.height);

      //   // Gradient
      //   mask = this.smoothEdgeMask(mask, imageData.width, imageData.height);

      //   // Apply mask
      //   applyMask(imageData, mask);
      // }

      // function applyMask(idata, mask) {
      //   for (var i = 0; i < idata.width * idata.height; i++) {
      //     idata.data[4 * i + 3] = mask[i];
      //   }
      // }

    },

    pixelAt: function (idata, x, y) {
      var idx = (y * idata.width + x) * 4;
      var d = [];
      d.push(
        idata.data[idx++],
        idata.data[idx++],
        idata.data[idx++],
        idata.data[idx++]
      );
      return d;
    },

    rgbDistance: function (p1, p2) {
      return Math.sqrt(
        Math.pow(p1[0] - p2[0], 2) +
        Math.pow(p1[1] - p2[1], 2) +
        Math.pow(p1[2] - p2[2], 2)
      );
    },

    rgbMean: function (pTab) {
      var m = [0, 0, 0];

      for (var i = 0; i < pTab.length; i++) {
        m[0] += pTab[i][0];
        m[1] += pTab[i][1];
        m[2] += pTab[i][2];
      }

      m[0] /= pTab.length;
      m[1] /= pTab.length;
      m[2] /= pTab.length;

      return m;
    },

    backgroundMask: function (idata, threshold) {
      var rgbv_no = this.pixelAt(idata, 0, 0);
      var rgbv_ne = this.pixelAt(idata, idata.width - 1, 0);
      var rgbv_so = this.pixelAt(idata, 0, idata.height - 1);
      var rgbv_se = this.pixelAt(idata, idata.width - 1, idata.height - 1);

      var thres = threshold || 10;
      if (
        this.rgbDistance(rgbv_no, rgbv_ne) < thres &&
        this.rgbDistance(rgbv_ne, rgbv_se) < thres &&
        this.rgbDistance(rgbv_se, rgbv_so) < thres &&
        this.rgbDistance(rgbv_so, rgbv_no) < thres
      ) {
        // Mean color
        var mean = this.rgbMean([rgbv_ne, rgbv_no, rgbv_se, rgbv_so]);

        // Mask based on color distance
        var mask = [];
        for (var i = 0; i < idata.width * idata.height; i++) {
          var d = this.rgbDistance(mean, [
            idata.data[i * 4],
            idata.data[i * 4 + 1],
            idata.data[i * 4 + 2],
          ]);
          mask[i] = d < thres ? 0 : 255;
        }

        return mask;
      }
    },



    erodeMask: function (mask, sw, sh) {
      var weights = [1, 1, 1, 1, 0, 1, 1, 1, 1];
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side / 2);

      var maskResult = [];
      for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
          var so = y * sw + x;
          var a = 0;
          for (var cy = 0; cy < side; cy++) {
            for (var cx = 0; cx < side; cx++) {
              var scy = y + cy - halfSide;
              var scx = x + cx - halfSide;

              if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                var srcOff = scy * sw + scx;
                var wt = weights[cy * side + cx];

                a += mask[srcOff] * wt;
              }
            }
          }

          maskResult[so] = a === 255 * 8 ? 255 : 0;
        }
      }

      return maskResult;
    },

    dilateMask: function (mask, sw, sh) {
      var weights = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side / 2);

      var maskResult = [];
      for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
          var so = y * sw + x;
          var a = 0;
          for (var cy = 0; cy < side; cy++) {
            for (var cx = 0; cx < side; cx++) {
              var scy = y + cy - halfSide;
              var scx = x + cx - halfSide;

              if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                var srcOff = scy * sw + scx;
                var wt = weights[cy * side + cx];

                a += mask[srcOff] * wt;
              }
            }
          }

          maskResult[so] = a >= 255 * 4 ? 255 : 0;
        }
      }

      return maskResult;
    },

    smoothEdgeMask: function (mask, sw, sh) {
      var weights = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
      var side = Math.round(Math.sqrt(weights.length));
      var halfSide = Math.floor(side / 2);

      var maskResult = [];
      for (var y = 0; y < sh; y++) {
        for (var x = 0; x < sw; x++) {
          var so = y * sw + x;
          var a = 0;
          for (var cy = 0; cy < side; cy++) {
            for (var cx = 0; cx < side; cx++) {
              var scy = y + cy - halfSide;
              var scx = x + cx - halfSide;

              if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                var srcOff = scy * sw + scx;
                var wt = weights[cy * side + cx];

                a += mask[srcOff] * wt;
              }
            }
          }

          maskResult[so] = a;
        }
      }

      return maskResult;
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {});
      // return {
      //   type: this.type,
      //   image: this.image && this.image.toObject(),
      //   mode: this.mode,
      //   alpha: this.alpha
      // };
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @param {function} callback to be invoked after filter creation
   * @return {fabric.Image.filters.BlendImage} Instance of fabric.Image.filters.BlendImage
   */
  fabric.Image.filters.Mask.fromObject = fabric.Image.filters.BaseFilter.fromObject;
  // fabric.Image.filters.BlendImage.fromObject = function(object, callback) {
  //   fabric.Image.fromObject(object.image, function(image) {
  //     var options = fabric.util.object.clone(object);
  //     options.image = image;
  //     callback(new fabric.Image.filters.BlendImage(options));
  //   });
  // };

})(typeof exports !== 'undefined' ? exports : this);
