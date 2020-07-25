$(function () {
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.padding = 5;


  var $ = function (id) { return document.getElementById(id) };


  var canvas = this.__canvas = new fabric.Canvas('c');
  canvas.setHeight(300);
  canvas.setWidth(500);


  function Addtext() {
    canvas.add(new fabric.IText('Tap and Type', {
      left: 50,
      top: 100,
      fontFamily: 'arial black',
      fill: '#333',
      fontSize: 50
    }));
  }

  document.getElementById('text-color').onchange = function () {
    canvas.getActiveObject().setFill(this.value);
    canvas.renderAll();
  };
  document.getElementById('text-color').onchange = function () {
    canvas.getActiveObject().setFill(this.value);
    canvas.renderAll();
  };

  document.getElementById('text-bg-color').onchange = function () {
    canvas.getActiveObject().setBackgroundColor(this.value);
    canvas.renderAll();
  };

  document.getElementById('text-lines-bg-color').onchange = function () {
    canvas.getActiveObject().setTextBackgroundColor(this.value);
    canvas.renderAll();
  };

  document.getElementById('text-stroke-color').onchange = function () {
    canvas.getActiveObject().setStroke(this.value);
    canvas.renderAll();
  };

  document.getElementById('text-stroke-width').onchange = function () {
    canvas.getActiveObject().setStrokeWidth(this.value);
    canvas.renderAll();
  };

  document.getElementById('font-family').onchange = function () {
    canvas.getActiveObject().setFontFamily(this.value);
    canvas.renderAll();
  };

  document.getElementById('text-font-size').onchange = function () {
    canvas.getActiveObject().setFontSize(this.value);
    canvas.renderAll();
  };

  document.getElementById('text-line-height').onchange = function () {
    canvas.getActiveObject().setLineHeight(this.value);
    canvas.renderAll();
  };

  document.getElementById('text-align').onchange = function () {
    canvas.getActiveObject().setTextAlign(this.value);
    canvas.renderAll();
  };


  radios5 = document.getElementsByName('fonttype');  // wijzig naar button
  for (var i = 0, max = radios5.length; i < max; i++) {
    radios5[i].onclick = function () {

      if (document.getElementById(this.id).checked === true) {
        if (this.id === 'text-cmd-bold') {
          canvas.getActiveObject().set('fontWeight', 'bold');
        }
        if (this.id === 'text-cmd-italic') {
          canvas.getActiveObject().set('fontStyle', 'italic');
        }
        if (this.id === 'text-cmd-underline') {
          canvas.getActiveObject().set('textDecoration', 'underline');
        }
        if (this.id === 'text-cmd-linethrough') {
          canvas.getActiveObject().set('textDecoration', 'line-through');
        }
        if (this.id === 'text-cmd-overline') {
          canvas.getActiveObject().set('textDecoration', 'overline');
        }



      } else {
        if (this.id === 'text-cmd-bold') {
          canvas.getActiveObject().set('fontWeight', '');
        }
        if (this.id === 'text-cmd-italic') {
          canvas.getActiveObject().set('fontStyle', '');
        }
        if (this.id === 'text-cmd-underline') {
          canvas.getActiveObject().set('textDecoration', '');
        }
        if (this.id === 'text-cmd-linethrough') {
          canvas.getActiveObject().set('textDecoration', '');
        }
        if (this.id === 'text-cmd-overline') {
          canvas.getActiveObject().set('textDecoration', '');
        }
      }


      canvas.renderAll();
    }
  }
  console.log('ready!');
})