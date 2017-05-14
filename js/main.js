/*global console, document, $ */
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
        ppts            = [];

    var tool = 'brush';
    $('#tools button').click(function () {
        tool = $(this).attr('id');
        log(tool);
    });

    tmpCanvas.className = 'tmpCanvas';
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;

    paint.appendChild(tmpCanvas);

    log(canvas);

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
        tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

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
        var x       = Math.min(mouse.x, start_mouse.x),
            y       = Math.min(mouse.y, start_mouse.y),
            width   = Math.abs(mouse.x - start_mouse.x),
            height  = Math.abs(mouse.y - start_mouse.y);

        tmpCtx.globalAlpha = 1;
        tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
        tmpCtx.strokeRect(x, y, width, height);
    }

    /**
     * Dessine un cercle
     *
     */
    function circle() {
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
        tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
        tmpCtx.beginPath();
        tmpCtx.arc(x, y, radius, 0, Math.PI * 2, false);
        tmpCtx.stroke();
        tmpCtx.closePath();
    }

    /**
     * Gomme
     *
     */
    function erase() {

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#FFF';
        ctx.stroke();
        ctx.closePath();
    }

    /* ***************************************************************** */
    /* ************************ CANVAS BY DEFAULT ********************* */
    /* ***************************************************************** */
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');

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

        tmpCanvas.addEventListener('mousemove', function(evt) {

            mouse.x = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
            mouse.y = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
        }, false);
        
        tmpCanvas.addEventListener('mousedown', function (evt) {
            mouse.x = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
            mouse.y = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;

            start_mouse.x = mouse.x;
            start_mouse.y = mouse.y;

            if (tool === 'brush') {
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
            } else if (tool === 'gomme') {
                tmpCanvas.addEventListener('mousemove', erase, false);
                erase();
            }
        }, false);

        tmpCanvas.addEventListener('mouseup', function () {
            tmpCanvas.removeEventListener('mousemove', brush, false);
            tmpCanvas.removeEventListener('mousemove', trait, false);
            tmpCanvas.removeEventListener('mousemove', rectangle, false);
            tmpCanvas.removeEventListener('mousemove', circle, false);
            tmpCanvas.removeEventListener('mousemove', erase, false);

            ctx.drawImage(tmpCanvas, 0, 0);
            tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

            ppts = [];
        }, false);
    }

});
