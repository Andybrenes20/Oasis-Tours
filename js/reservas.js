document.addEventListener('DOMContentLoaded', () => {
    const botonesReserva = document.querySelectorAll('.btn-reserva');

    if (!botonesReserva.length) return;

    const modal = document.createElement('div');
    modal.className = 'modal-reserva';
    modal.hidden = true;
    modal.innerHTML = `
        <div class="modal-reserva__fondo" data-cerrar-modal></div>
        <section class="modal-reserva__contenido" role="dialog" aria-modal="true" aria-labelledby="titulo-pago">
            <button class="modal-reserva__cerrar" type="button" aria-label="Cerrar formas de pago" data-cerrar-modal>&times;</button>
            <p class="modal-reserva__etiqueta">Completa tu reserva</p>
            <h2 id="titulo-pago">Elige una forma de pago</h2>
            <p class="modal-reserva__detalle"></p>
            <form class="formas-pago">
                <label class="forma-pago">
                    <input type="radio" name="forma-pago" value="Tarjeta de crédito o débito" checked>
                    <span><strong>Tarjeta</strong><small>Crédito o débito</small></span>
                </label>
                <label class="forma-pago">
                    <input type="radio" name="forma-pago" value="Transferencia bancaria">
                    <span><strong>Transferencia bancaria</strong><small>Te enviaremos los datos de la cuenta</small></span>
                </label>
                <label class="forma-pago">
                    <input type="radio" name="forma-pago" value="Pago en efectivo">
                    <span><strong>Efectivo</strong><small>Paga al llegar al lugar</small></span>
                </label>
                <fieldset class="datos-tarjeta" aria-describedby="aviso-seguridad">
                    <legend>Datos de la tarjeta</legend>
                    <div class="datos-tarjeta__campo datos-tarjeta__campo--completo">
                        <label for="titular-tarjeta">Nombre del titular</label>
                        <input id="titular-tarjeta" name="titular-tarjeta" type="text" autocomplete="cc-name" placeholder="Como aparece en la tarjeta" disabled>
                    </div>
                    <div class="datos-tarjeta__campo datos-tarjeta__campo--completo">
                        <label for="numero-tarjeta">Número de tarjeta</label>
                        <input id="numero-tarjeta" name="numero-tarjeta" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="19" disabled>
                    </div>
                    <div class="datos-tarjeta__campo">
                        <label for="vencimiento-tarjeta">Vencimiento</label>
                        <input id="vencimiento-tarjeta" name="vencimiento-tarjeta" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/AA" maxlength="5" disabled>
                    </div>
                    <div class="datos-tarjeta__campo">
                        <label for="cvv-tarjeta">CVV</label>
                        <input id="cvv-tarjeta" name="cvv-tarjeta" type="password" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4" disabled>
                    </div>
                    <p id="aviso-seguridad" class="datos-tarjeta__aviso">Esta demostración no procesa ni almacena datos de pago.</p>
                </fieldset>
                <button class="modal-reserva__confirmar" type="submit">Continuar con el pago</button>
            </form>
            <p class="modal-reserva__mensaje" aria-live="polite"></p>
        </section>
    `;
    document.body.appendChild(modal);

    const detalle = modal.querySelector('.modal-reserva__detalle');
    const mensaje = modal.querySelector('.modal-reserva__mensaje');
    const formulario = modal.querySelector('.formas-pago');
    const datosTarjeta = modal.querySelector('.datos-tarjeta');
    const camposTarjeta = datosTarjeta.querySelectorAll('input');
    const actualizarFormularioTarjeta = () => {
        const esTarjeta = modal.querySelector('input[name="forma-pago"]:checked').value === 'Tarjeta de crédito o débito';
        datosTarjeta.hidden = !esTarjeta;
        camposTarjeta.forEach((campo) => {
            campo.disabled = !esTarjeta;
            campo.required = esTarjeta;
        });
    };
    const cerrarModal = () => {
        modal.hidden = true;
        document.body.classList.remove('modal-abierto');
    };

    botonesReserva.forEach((boton) => {
        boton.addEventListener('click', (evento) => {
            evento.preventDefault();
            const tarjeta = boton.closest('.card');
            const nombre = tarjeta?.querySelector('h3')?.textContent.trim() || 'tu reserva';
            detalle.textContent = `Selecciona cómo deseas pagar: ${nombre}.`;
            mensaje.textContent = '';
            formulario.reset();
            actualizarFormularioTarjeta();
            modal.hidden = false;
            document.body.classList.add('modal-abierto');
            modal.querySelector('input[name="forma-pago"]:checked').focus();
        });
    });

    modal.querySelectorAll('[data-cerrar-modal]').forEach((elemento) => {
        elemento.addEventListener('click', cerrarModal);
    });

    modal.querySelectorAll('input[name="forma-pago"]').forEach((opcion) => {
        opcion.addEventListener('change', actualizarFormularioTarjeta);
    });

    modal.querySelector('#numero-tarjeta').addEventListener('input', (evento) => {
        evento.target.value = evento.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    });

    modal.querySelector('#vencimiento-tarjeta').addEventListener('input', (evento) => {
        const digitos = evento.target.value.replace(/\D/g, '').slice(0, 4);
        evento.target.value = digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
    });

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const formaSeleccionada = modal.querySelector('input[name="forma-pago"]:checked').value;
        mensaje.textContent = formaSeleccionada === 'Tarjeta de crédito o débito'
            ? 'Datos capturados para esta demostración. Integra una pasarela de pago segura antes de cobrar en línea.'
            : `Seleccionaste: ${formaSeleccionada}. Nos comunicaremos contigo para finalizar tu reserva.`;
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && !modal.hidden) cerrarModal();
    });
});
