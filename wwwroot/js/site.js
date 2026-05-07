/* ============================================================
   CATÁLOGO DE VIDEOJUEGOS - site.js
   ============================================================
   Animaciones y efectos interactivos
   Pega este contenido en wwwroot/js/site.js
   ============================================================ */


/* ============================================================
   1. ANIMACIÓN DE ENTRADA - Cards y elementos al hacer scroll
   ============================================================
   Las tarjetas y secciones aparecen con fade + slide al entrar
   en pantalla. Agrega la clase "animar-entrada" a cualquier
   elemento que quieras que aparezca animado.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Inyectar estilos de animación dinámicamente ---
    const estilosAnimacion = document.createElement('style');
    estilosAnimacion.textContent = `
        .animar-entrada {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .animar-entrada.visible {
            opacity: 1;
            transform: translateY(0);
        }
        /* Delay escalonado para grids de cards */
        .animar-entrada:nth-child(2) { transition-delay: 0.07s; }
        .animar-entrada:nth-child(3) { transition-delay: 0.14s; }
        .animar-entrada:nth-child(4) { transition-delay: 0.21s; }
        .animar-entrada:nth-child(5) { transition-delay: 0.28s; }
        .animar-entrada:nth-child(6) { transition-delay: 0.35s; }
        .animar-entrada:nth-child(n+7) { transition-delay: 0.4s; }
    `;
    document.head.appendChild(estilosAnimacion);

    // Agregar clase "animar-entrada" automáticamente a las cards y filas de tabla
    document.querySelectorAll('.card, tbody tr, .seccion-box').forEach(el => {
        el.classList.add('animar-entrada');
    });

    // Observer que activa la animación cuando el elemento entra al viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Solo anima una vez
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animar-entrada').forEach(el => observer.observe(el));
});


/* ============================================================
   2. EFECTO PARTÍCULAS / DESTELLO en las cards al hacer hover
   ============================================================
   Al pasar el mouse por una card, aparece un reflejo de luz
   que sigue el cursor (efecto "tilt glow").
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.card').forEach(card => {

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // Gradiente de luz que sigue al cursor
            card.style.background = `
                radial-gradient(circle at ${x}% ${y}%, rgba(124,58,237,0.12) 0%, transparent 65%),
                var(--color-fondo-card, #13131f)
            `;

            // Leve efecto 3D tilt
            const tiltX = ((y / 100) - 0.5) * 8;
            const tiltY = (0.5 - (x / 100)) * 8;
            card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = '';
            card.style.transform = '';
        });
    });
});


/* ============================================================
   3. NAVBAR - Ocultar al bajar, mostrar al subir
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll <= 60) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.transition = 'transform 0.3s ease';
            return;
        }

        if (currentScroll > lastScroll) {
            // Bajando → ocultar navbar
            navbar.style.transform = 'translateY(-100%)';
            navbar.style.transition = 'transform 0.3s ease';
        } else {
            // Subiendo → mostrar navbar
            navbar.style.transform = 'translateY(0)';
            navbar.style.transition = 'transform 0.3s ease';
        }

        lastScroll = currentScroll;
    });
});


/* ============================================================
   4. CONTADOR ANIMADO
   ============================================================
   Útil para mostrar "Total de juegos: 120" con animación.
   Agrega el atributo data-contador="120" a cualquier elemento
   y se animará al entrar en pantalla.

   Ejemplo en tu HTML:
   <span data-contador="120"></span>
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const contadores = document.querySelectorAll('[data-contador]');
    if (!contadores.length) return;

    const animarContador = (el) => {
        const objetivo = parseInt(el.getAttribute('data-contador'));
        const duracion = 1500; // ms
        const inicio = performance.now();

        const tick = (ahora) => {
            const progreso = Math.min((ahora - inicio) / duracion, 1);
            const easeOut = 1 - Math.pow(1 - progreso, 3);
            el.textContent = Math.floor(easeOut * objetivo);
            if (progreso < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animarContador(e.target);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    contadores.forEach(c => obs.observe(c));
});


/* ============================================================
   5. BUSCADOR CON FILTRO EN TIEMPO REAL
   ============================================================
   Filtra las cards o filas de tabla mientras escribes.
   Agrega id="buscador-live" a tu input de búsqueda y
   la clase "item-filtrable" a cada card o fila.

   Ejemplo en tu HTML:
   <input id="buscador-live" placeholder="Buscar juego..." />
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const buscador = document.getElementById('buscador-live');
    if (!buscador) return;

    buscador.addEventListener('input', () => {
        const query = buscador.value.toLowerCase().trim();
        const items = document.querySelectorAll('.item-filtrable, .card, tbody tr');

        items.forEach(item => {
            const texto = item.textContent.toLowerCase();
            const coincide = texto.includes(query);
            item.style.transition = 'opacity 0.25s ease';
            item.style.opacity = coincide ? '1' : '0.15';
            item.style.pointerEvents = coincide ? '' : 'none';
        });
    });
});


/* ============================================================
   6. TOAST / NOTIFICACIÓN FLASH
   ============================================================
   Muestra una notificación flotante desde código JS.
   Llama a: mostrarToast("Juego agregado correctamente", "exito")
   Tipos disponibles: "exito" | "error" | "alerta" | "info"
   ============================================================ */

function mostrarToast(mensaje, tipo = 'info') {

    // Crear contenedor si no existe
    let contenedor = document.getElementById('toast-contenedor');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'toast-contenedor';
        contenedor.style.cssText = `
            position: fixed; bottom: 24px; right: 24px;
            z-index: 9999; display: flex;
            flex-direction: column; gap: 10px;
        `;
        document.body.appendChild(contenedor);
    }

    const colores = {
        exito: { bg: 'rgba(6,214,160,0.12)', borde: '#06d6a0', icono: '✓' },
        error: { bg: 'rgba(255,77,109,0.12)', borde: '#ff4d6d', icono: '✕' },
        alerta: { bg: 'rgba(255,214,10,0.12)', borde: '#ffd60a', icono: '⚠' },
        info: { bg: 'rgba(124,58,237,0.12)', borde: '#7c3aed', icono: 'ℹ' },
    };

    const c = colores[tipo] || colores.info;
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${c.bg}; border-left: 3px solid ${c.borde};
        color: #e2e2f0; padding: 12px 18px;
        border-radius: 8px; font-size: 0.9rem;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        display: flex; align-items: center; gap: 10px;
        min-width: 260px; max-width: 360px;
        opacity: 0; transform: translateX(40px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    toast.innerHTML = `<span style="font-size:1.1rem">${c.icono}</span> ${mensaje}`;
    contenedor.appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });

    // Auto-cerrar después de 3.5s
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        setTimeout(() => toast.remove(), 350);
    }, 3500);
}

// Exponer globalmente para usarla desde las vistas
window.mostrarToast = mostrarToast;


/* ============================================================
   7. CONFIRM DE ELIMINACIÓN PERSONALIZADO
   ============================================================
   Reemplaza el confirm() del navegador por un modal bonito.
   Agrega data-confirmar="¿Eliminar este juego?" a tu botón
   de eliminar y data-form="idDelFormulario".

   Ejemplo en tu HTML:
   <button data-confirmar="¿Eliminar este juego?"
           data-form="form-eliminar-1">Eliminar</button>
   <form id="form-eliminar-1" method="post" action="/Catalogo/Delete/1"></form>
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // Inyectar modal de confirmación
    const modalHTML = `
    <div id="modal-confirmar" style="
        display:none; position:fixed; inset:0; z-index:10000;
        background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);
        align-items:center; justify-content:center;">
        <div style="
            background:#13131f; border:1px solid #2a2a3d;
            border-radius:12px; padding:2rem; max-width:380px;
            width:90%; box-shadow:0 0 40px rgba(124,58,237,0.2);
            text-align:center;">
            <div style="font-size:2.5rem; margin-bottom:0.75rem;">🗑️</div>
            <p id="modal-confirmar-msg" style="color:#e2e2f0; margin-bottom:1.5rem; font-size:1rem;"></p>
            <div style="display:flex; gap:12px; justify-content:center;">
                <button id="modal-confirmar-si" style="
                    background:#ff4d6d; border:none; color:#fff;
                    padding:0.5rem 1.5rem; border-radius:8px;
                    cursor:pointer; font-weight:600;
                    transition:box-shadow 0.2s;">Eliminar</button>
                <button id="modal-confirmar-no" style="
                    background:transparent; border:1px solid #2a2a3d;
                    color:#8888aa; padding:0.5rem 1.5rem;
                    border-radius:8px; cursor:pointer;
                    transition:background 0.2s;">Cancelar</button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('modal-confirmar');
    const btnSi = document.getElementById('modal-confirmar-si');
    const btnNo = document.getElementById('modal-confirmar-no');
    const msgEl = document.getElementById('modal-confirmar-msg');
    let formTarget = null;

    document.querySelectorAll('[data-confirmar]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            msgEl.textContent = btn.getAttribute('data-confirmar') || '¿Estás seguro?';
            formTarget = document.getElementById(btn.getAttribute('data-form'));
            modal.style.display = 'flex';
        });
    });

    btnSi.addEventListener('click', () => {
        if (formTarget) formTarget.submit();
        modal.style.display = 'none';
    });

    btnNo.addEventListener('click', () => {
        modal.style.display = 'none';
        formTarget = null;
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            formTarget = null;
        }
    });
});


/* ============================================================
   8. BOTÓN "VOLVER ARRIBA"
   ============================================================
   Aparece automáticamente cuando el usuario baja en la página.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.title = 'Volver arriba';
    btn.style.cssText = `
        position: fixed; bottom: 28px; left: 28px; z-index: 999;
        width: 42px; height: 42px; border-radius: 50%;
        background: var(--color-acento, #7c3aed);
        color: #fff; border: none; font-size: 1.2rem;
        cursor: pointer; opacity: 0; pointer-events: none;
        transition: opacity 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 0 0 rgba(124,58,237,0);
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            btn.style.boxShadow = '0 0 16px rgba(124,58,237,0.5)';
        } else {
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});


/* ============================================================
   FIN DEL ARCHIVO
   ============================================================
   GUÍA RÁPIDA:
   - Animaciones de entrada: automáticas en .card y tbody tr
   - Tilt en cards:          automático al hacer hover
   - Buscador live:          agrega id="buscador-live" a tu input
   - Toast:                  llama mostrarToast("msg", "exito")
   - Confirmar eliminación:  agrega data-confirmar y data-form al botón
   - Contador animado:       agrega data-contador="100" al elemento
   - Navbar scroll:          automático
   - Botón arriba:           automático
   ============================================================ */