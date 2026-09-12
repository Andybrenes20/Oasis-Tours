document.addEventListener('DOMContentLoaded', () => {
    const elementosGaleria = document.querySelectorAll('[data-galeria-imagen]');

    if (!elementosGaleria.length) return;

    const visor = document.createElement('div');
    visor.className = 'visor-galeria';
    visor.hidden = true;
    visor.innerHTML = `
        <div class="visor-galeria__fondo" data-cerrar-visor></div>
        <section class="visor-galeria__contenido" role="dialog" aria-modal="true" aria-label="Imagen ampliada">
            <button type="button" class="visor-galeria__cerrar" aria-label="Cerrar imagen" data-cerrar-visor>&times;</button>
            <img src="" alt="">
        </section>
    `;
    document.body.appendChild(visor);

    const imagenVisor = visor.querySelector('img');
    const cerrarVisor = () => {
        visor.hidden = true;
        document.body.classList.remove('modal-abierto');
    };

    elementosGaleria.forEach((elemento) => {
        elemento.addEventListener('click', () => {
            imagenVisor.src = elemento.dataset.galeriaImagen;
            imagenVisor.alt = elemento.dataset.galeriaAlt;
            visor.hidden = false;
            document.body.classList.add('modal-abierto');
            visor.querySelector('.visor-galeria__cerrar').focus();
        });
    });

    visor.querySelectorAll('[data-cerrar-visor]').forEach((elemento) => {
        elemento.addEventListener('click', cerrarVisor);
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && !visor.hidden) cerrarVisor();
    });
});
