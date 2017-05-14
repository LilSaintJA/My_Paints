/*global console, document, $, window, Image */
$(function () {
    'use strict';

    /**
     * Fonction de debug
     *
     * @param D
     */
    function log(D) {
        console.log(D);
    }
    console.log('jQuery Is Ready');

    var canvas          = document.getElementById('myCanvas'),
        paint           = document.querySelector('.paint'),
        tmpCanvas       = document.createElement('canvas'),
        tmpCtx          = tmpCanvas.getContext('2d'),
        ctx,
        mouse           = {x: 0, y: 0},
        last_mouse      = {x: 0, y: 0},
        start_mouse     = {x: 0, y: 0},
        ppts            = [],
        tool            = 'pencil';


    $('#tools button').click(function () {
        tool = $(this).attr('id');
        log(tool);
    });

    if (tool === 'gomme') {
        // Hide Tmp Canvas
        tmpCanvas.style.display = 'none';
    } else if (tool === 'pencil') {
        tmpCanvas.style.display = 'block';
    }

    /**
     * Nettoie le canvas
     *
     */
    function clearCanvas() {
        tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
    }

    /**
     * Dessine le canvas sans options
     *
     */
    function drawCanvas() {

        tmpCtx.beginPath();
        tmpCtx.moveTo(last_mouse.x, last_mouse.y);
        tmpCtx.lineTo(mouse.x, mouse.y);
        tmpCtx.stroke();
        tmpCtx.closePath();
    }

    /**
     * Simule un dessin au pinceau
     *
     */
    function brush() {

        var crayonTexture = new Image();
        crayonTexture.src = 'img/crayon-texture.png';
        // crayonTexture.src = 'img/paint-before2.png';

        tmpCtx.drawImage(crayonTexture, 0, 0, tmpCanvas.width, tmpCanvas.height);
        tmpCtx.beginPath();
        tmpCtx.moveTo(last_mouse.x, last_mouse.y);
        tmpCtx.lineTo(mouse.x, mouse.y);
        tmpCtx.globalAlpha = 0.4;
    }

    /**
     * Dessine un trait
     *
     */
    function trait() {
        clearCanvas();

        tmpCtx.beginPath();
        tmpCtx.moveTo(start_mouse.x, start_mouse.y);
        tmpCtx.lineTo(mouse.x, mouse.y);
        tmpCtx.globalAlpha = 1;
        tmpCtx.stroke();
        tmpCtx.closePath();
    }

    /**
     * Dessine un rectangle
     *
     */
    function rectangle() {
        clearCanvas();

        var x       = Math.min(mouse.x, start_mouse.x),
            y       = Math.min(mouse.y, start_mouse.y),
            width   = Math.abs(mouse.x - start_mouse.x),
            height  = Math.abs(mouse.y - start_mouse.y);

        tmpCtx.globalAlpha = 1;
        tmpCtx.strokeRect(x, y, width, height);
    }

    /**
     * Dessine un rectangle plein
     *
     */
    function rectangleFull() {
        clearCanvas();

        var x       = Math.min(mouse.x, start_mouse.x),
            y       = Math.min(mouse.y, start_mouse.y),
            width   = Math.abs(mouse.x - start_mouse.x),
            height  = Math.abs(mouse.y - start_mouse.y);

        tmpCtx.globalAlpha = 1;
        tmpCtx.fillRect(x, y, width, height);
    }

    /**
     * Dessine un cercle
     *
     */
    function circle() {
        clearCanvas();

        var x,
            y,
            radius;

        x = (mouse.x + start_mouse.x) / 2;
        y = (mouse.y + start_mouse.y) / 2;

        radius = Math.max(
            Math.abs(mouse.x - start_mouse.x),
            Math.abs(mouse.y - start_mouse.y)
        ) / 2;

        tmpCtx.globalAlpha = 1;
        tmpCtx.beginPath();
        tmpCtx.arc(x, y, radius, 0, Math.PI * 2, false);
        tmpCtx.stroke();
        tmpCtx.closePath();
    }

    /**
     * Dessine un cercle plein
     *
     */
    function circleFull() {
        clearCanvas();

        var x,
            y,
            radius;

        x = (mouse.x + start_mouse.x) / 2;
        y = (mouse.y + start_mouse.y) / 2;

        radius = Math.max(
            Math.abs(mouse.x - start_mouse.x),
            Math.abs(mouse.y - start_mouse.y)
        ) / 2;

        tmpCtx.globalAlpha = 1;
        tmpCtx.beginPath();
        tmpCtx.arc(x, y, radius, 0, Math.PI * 2, false);
        tmpCtx.fill();
        tmpCtx.closePath();
    }

    /**
     * Gomme
     *
     */
    function erase() {
        // Saving all the points in an array
        ppts.push({x: mouse.x, y: mouse.y});

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';

        if (ppts.length < 3) {
            ctx.beginPath();
            ctx.fill();
            ctx.closePath();

            return false;
        }

        ctx.beginPath();
        ctx.moveTo(ppts[0].x, ppts[0].y);

        ctx.stroke();
    }

    /* ***************************************************************** */
    /* ************************ CANVAS BY DEFAULT ********************* */
    /* ***************************************************************** */
    if (canvas.getContext) {
        log(tool);
        ctx = canvas.getContext('2d');

        tmpCanvas.className = 'tmpCanvas';
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = canvas.height;

        paint.appendChild(tmpCanvas);

        tmpCtx.lineJoin = 'round';
        tmpCtx.lineCap = 'round';

        // Change l'epaisseur du trait
        $('.largeur').on('input', function () {
            var largeur = $(".largeur").val();
            tmpCtx.lineWidth = largeur;
        });

        // Change la couleur du trait
        $('.colors').on('change', function () {
            var color = $('.colors').val();
            tmpCtx.strokeStyle = color;
            tmpCtx.fillStyle = color;
        });

        tmpCanvas.addEventListener('mousemove', function (evt) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = evt.pageX - this.offsetLeft;
            mouse.y = evt.pageY - this.offsetTop;
        }, false);

        tmpCanvas.addEventListener('mousedown', function () {
            tmpCanvas.addEventListener('mousemove', drawCanvas, false);
        }, false);

        tmpCanvas.addEventListener('mouseup', function () {
            tmpCanvas.removeEventListener('mousemove', drawCanvas, false);
        }, false);

        /* ***************************************************************** */
        /* ************************ MANAGE OPTIONS ************************ */
        /* ***************************************************************** */

        tmpCanvas.addEventListener('mousemove', function (evt) {

            mouse.x = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
            mouse.y = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
        }, false);

        canvas.addEventListener('mousemove', function (evt) {

            mouse.x = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
            mouse.y = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
        }, false);

        tmpCanvas.addEventListener('mousedown', function (evt) {
            mouse.x = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
            mouse.y = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            if (tool === 'pencil') {
                tmpCanvas.addEventListener('mousemove', drawCanvas, false);
                drawCanvas();
            } else if (tool === 'brush') {
                tmpCanvas.addEventListener('mousemove', brush, false);
                brush();
            } else if (tool === 'trait') {
                tmpCanvas.addEventListener('mousemove', trait, false);
                trait();
            } else if (tool === 'rectangle') {
                tmpCanvas.addEventListener('mousemove', rectangle, false);
                rectangle();
            } else if (tool === 'circle') {
                tmpCanvas.addEventListener('mousemove', circle, false);
                circle();
            } else if (tool === 'rectangleFull') {
                tmpCanvas.addEventListener('mousemove', rectangleFull, false);
                rectangleFull();
            } else if (tool === 'circleFull') {
                tmpCanvas.addEventListener('mousemove', circleFull, false);
                circleFull();
            } else if (tool === 'gomme') {
                tmpCanvas.addEventListener('mousemove', erase, false);
                erase();
            }

        }, false);

        tmpCanvas.addEventListener('mouseup', function () {
            tmpCanvas.removeEventListener('mousemove', brush, false);
            tmpCanvas.removeEventListener('mousemove', trait, false);
            tmpCanvas.removeEventListener('mousemove', rectangle, false);
            tmpCanvas.removeEventListener('mousemove', rectangleFull, false);
            tmpCanvas.removeEventListener('mousemove', circle, false);
            tmpCanvas.removeEventListener('mousemove', circleFull, false);
            tmpCanvas.removeEventListener('mousemove', erase, false);

            ctx.globalCompositeOperation = 'source-over';

            ctx.drawImage(tmpCanvas, 0, 0);
            tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

            ppts = [];
        }, false);

        // Sauvegarder le dessin
        $('.saveCanvas').click(function () {
            var dataUrl = canvas.toDataURL('image/png');
            window.open(dataUrl, "toDataURL() image", 'width=canvas.width, height=canvas.height');
        });
    }

});
