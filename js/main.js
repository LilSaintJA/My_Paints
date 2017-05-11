/*global console */
$(function() {

    /**
     * Fonction de debug
     *
     * @param D
     */
    function log(D) {
        console.log(D);
    }
    console.log('jQuery Is Ready');

    /**
     * Gère my_paint
     */
    function drawCanvas() {
        var canvas = document.getElementById('myCanvas'),
            mouse = {x: 0, y: 0};

        log(canvas);

        // Vérifie si le canvas est dispo
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');

            ctx.beginPath(); // Initialise un nouveau trajet
            ctx.moveTo(100, 50); // Position initiale du tracet
            ctx.lineTo(200, 100); // Déplacement du tracé
            ctx.fill(); // Trace le dessin

            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000000';

            canvas.addEventListener('mousemove', function (e) {
               mouse.x = e.pageX - this.offsetLeft;
               mouse.y = e.pageY - this.offsetTop;
            }, false);


            // Change l'epaisseur du trait
            $('.largeur').on('input', function() {
                var largeur = $(".largeur").val();
                // log(largeur);
                // log(size);
                ctx.lineWidth = largeur;
            });

            // Change la couleur du trait
            $('.colors').on('change', function () {
                log('je suis la');
                var color = $('.colors').val();
                log(color);
                ctx.strokeStyle = color;
            });

            // Gomme
            $('.gomme').click(function () {
                eraser();
            });

            canvas.addEventListener('mousedown', function (e) {
               ctx.beginPath();
               ctx.moveTo(mouse.x, mouse.y);

               canvas.addEventListener('mousemove', onPaint, false);
            }, false);

            canvas.addEventListener('mouseup', function () {
                canvas.removeEventListener('mousemove', onPaint, false);
            }, false);

            /**
             * Pinceau libre
             */
            function onPaint() {
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }

            /**
             * Gomme le canvas de la même façon que le pinceau
             *
             */
            function eraser() {
                log('Je gomme');
                canvas.addEventListener('click', function (e) {
                    mouse.x = e.pageX - this.offsetLeft;
                    mouse.y = e.pageY - this.offsetTop;
                    ctx.clearRect(mouse.x, mouse.y, canvas.width, canvas.height);
                });
                ctx.globalCompositeOperation = 'destination-out';
                ctx.strokeStyle = 'rgba(0, 0, 0, 1.0)';
            }
        }
    }

    drawCanvas();
});
