/*global console, document, $ */

$(function () {
    'use strict';

    /**
     * Debug
     * @param D
     */
    function log(D) {
        console.log(D);
    }

    log('jQuery Is Ready');

    var canvas          = document.getElementById('myCanvas'),
        ctx,
        clickX          = [],
        clickY          = [],
        startClickX     = [],
        startClickY     = [],
        clickDrag       = [],
        paint,
        size,
        color,
        changeColor     = [],
        changeSize      = [];

    function drawCanvas() {
        var i;

        ctx.lineJoin = 'round';

        for (i = 0; i < clickX.length; i += 1) {
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

    /**
     * dessine un trait
     *
     */
    function trait() {
        var i;

        ctx.lineJoin = 'round';

        for (i = 0; i < clickX.length; i += 1) {
            ctx.beginPath();

            // if (clickDrag[i] && i) {
            //     ctx.moveTo(startClickX[i - 1], startClickY[i - 1]);
            // } else {
            //     ctx.moveTo(startClickX[i] - 1, startClickY[i]);
            // }
            ctx.moveTo(startClickX[i - 1], startClickY[i - 1]);
            ctx.lineTo(clickX[i], clickY[i]);
            ctx.closePath();
            ctx.strokeStyle = changeColor[i];
            ctx.lineWidth = changeSize[i];
            ctx.stroke();
        }

    }

    function rectangle() {
        // log('rectangle');
        var i,
            x,
            y,
            width,
            height;

        for (i = 0; i < clickX.length; i += 1) {
            x = Math.min(startClickX[i - 1]);
            y = Math.min(startClickY[i - 1]);
            width = Math.abs(clickX[i]);
            height = Math.abs(clickY[i]);

            ctx.strokeRect(x, y, width, height);

            ctx.strokeStyle = changeColor[i];
            ctx.lineWidth = changeSize[i];
            ctx.stroke();
        }

        log(x);
        log(y);
        log('-----------------');
        log(width);
        log(height);
    }

    function rond() {
        log('round');
    }

    /**
     * Save the click position,
     * options change {color, size, tools}
     * @param x
     * @param y
     * @param dragging
     */
    function canvasClick(x, y, dragging) {
        color = $('.colors').val();
        size  = $('.largeur').val();

        clickX.push(x);
        clickY.push(y);

        startClickX.push(x);
        startClickY.push(y);

        clickDrag.push(dragging);

        $('.gomme').click(function () {
            changeColor.push('#FFF');
        });

        changeColor.push(color);
        changeSize.push(size);
    }

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');

        // On click avec la souris
        canvas.addEventListener('mousedown', function (evt) {

            paint = true;

            canvasClick(evt.pageX - this.offsetLeft, evt.pageY - this.offsetTop);
            drawCanvas();

            // On bouge avec la souris
            canvas.addEventListener('mousemove', function (evt) {
                var self = this;
                if (paint) {
                    canvasClick(evt.pageX - self.offsetLeft, evt.pageY - self.offsetTop, true);
                    drawCanvas();
                }
            });
        });

        $('.trait').click(function () {
            canvas.addEventListener('mousedown', function (evt) {

                paint = true;
                canvasClick(evt.pageX - this.offsetLeft, evt.pageY - this.offsetTop);
                trait();

                // On bouge avec la souris
                canvas.addEventListener('mousemove', function (evt) {
                    var self = this;
                    if (paint) {
                        canvasClick(evt.pageX - self.offsetLeft, evt.pageY - self.offsetTop, true);
                        trait();
                    }
                });
            });

        }); // End of Trait

        $('.rectangle').click(function () {
            canvas.addEventListener('mousedown', function (evt) {
                paint = true;
                // canvasClick(evt.pageX - this.offsetLeft, evt.pageY - this.offsetTop);
                // rectangle();

                // On bouge avec la souris
                canvas.addEventListener('mousemove', function (evt) {
                    var self = this;
                    if (paint) {
                        canvasClick(evt.pageX - self.offsetLeft, evt.pageY - self.offsetTop, true);
                        rectangle();
                    }
                });
            });
        }); // End of Rectangle

        // On relache le bouton de la souris
        canvas.addEventListener('mouseup', function () {
            paint = false;
        });

        // la souris quiite le canvas
        canvas.addEventListener('mouseleave', function () {
            paint = false;
        });
    }
});