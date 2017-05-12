/*global console */

$(function() {
    'use strict';

    function log(D) {
        console.log(D);
    }

    log('jQuery Is Ready');

    var canvas          = document.getElementById('myCanvas'),
        ctx,
        clickX          = [],
        clickY          = [],
        clickDrag       = [],
        paint,
        size,
        color,
        changeColor     = [],
        changeSize      = [];
    log(canvas);
    log(clickX);
    log(clickY);

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');

        // On click avec la souris
        canvas.addEventListener('mousedown', function (evt) {
           var mouseX = evt.pageX - this.offsetLeft,
               mouseY = evt.pageY - this.offsetTop;


           paint = true;
           canvasClick(evt.pageX - this.offsetLeft, evt.pageY - this.offsetTop);
           drawCanvas();

            // On bouge avec la souris
            canvas.addEventListener('mousemove', function (evt) {
                if (paint) {
                    canvasClick(evt.pageX - this.offsetLeft, evt.pageY - this.offsetTop, true);
                    drawCanvas();
                }
            });
        });



        // On relache le bouton de la souris
        canvas.addEventListener('mouseup', function () {
            paint = false;
        });

        // la souris quiite le canvas
        canvas.addEventListener('mouseleave', function () {
            paint = false;
        });
    }

    function drawCanvas() {
        var i;

        // ctx.strokeStyle = '#000';
        ctx.lineJoin = 'round';
        // ctx.lineWidth = 5;

        for(i = 0; i < clickX.length; i += 1) {
            ctx.beginPath();

            if (clickDrag[i] && i) {
                ctx.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                ctx.moveTo(clickX[i] - 1, clickY[i]);
            }
            ctx.lineTo(clickX[i], clickY[i]);
            ctx.closePath();
            ctx.strokeStyle = changeColor[i];
            ctx.lineWidth = changeSize[i];
            ctx.stroke();
        }
    }
    
    function canvasClick(x, y, dragging) {
        color = $('.colors').val();
        size  = $('.largeur').val();
        
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        changeColor.push(color);
        changeSize.push(size);
    }
});