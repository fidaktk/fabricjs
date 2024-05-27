(function (global) {
  'use strict';

  var fabric = global.fabric,
    filters = fabric.Image.filters,
    createClass = fabric.util.createClass;

  filters.Mask = createClass(filters.BaseFilter, {
    type: 'Mask',
    mask: null,
    threshold: 0.5,
    feather: 0.2,
    invert: false,

    applyTo2d: function (options) {
      if (!this.mask) return;
      var imageData = options.imageData,
        resources = options.filterBackend.resources,
        data = imageData.data, iLen = data.length,
        width = imageData.width,
        height = imageData.height,
        tr, tg, tb, ta,
        r, g, b, a,
        canvas1, context, blendData;

      if (!resources.blendImage) {
        resources.blendImage = fabric.util.createCanvasElement();
      }
      canvas1 = resources.blendImage;
      context = canvas1.getContext('2d', { willReadFrequently: true });

      if (canvas1.width !== width || canvas1.height !== height) {
        canvas1.width = width;
        canvas1.height = height;
      } else {
        context.clearRect(0, 0, width, height);
      }

      context.setTransform(this.mask.scaleX, 0, 0, this.mask.scaleY, this.mask.left, this.mask.top);
      context.drawImage(this.mask._element, 0, 0, width, height);
      blendData = context.getImageData(0, 0, width, height).data;

      for (var i = 0; i < iLen; i += 4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        a = data[i + 3];

        tr = blendData[i];
        tg = blendData[i + 1];
        tb = blendData[i + 2];
        ta = blendData[i + 3];
        var maskValue = (tr + tg + tb) / (3 * 255);

        // Apply threshold and feathering
        var alpha = Math.max(0, Math.min(1, (maskValue - this.threshold) / this.feather));
        if (this.invert) {
          alpha = 1 - alpha;
        }

        data[i + 3] = alpha * a;  // Modify the alpha channel
      }
    },

    toObject: function () {
      var obj = {
        type: this.type,
        mask: this.mask && this.mask.toObject(),
        threshold: this.threshold,
        feather: this.feather,
        invert: this.invert,
      };
      return fabric.util.object.extend(this.callSuper('toObject'), obj);
    }
  });

  fabric.Image.filters.Mask.fromObject = function (object, callback) {
    fabric.Image.fromObject(object.mask, function (mask) {
      var options = fabric.util.object.clone(object);
      options.mask = mask;
      callback(new fabric.Image.filters.Mask(options));
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
