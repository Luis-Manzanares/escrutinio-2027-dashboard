/* ================================================================
   main.js — Escrutinio 2027 | Dashboard de Digitación Masiva
   Funcionalidades: modo daltónico, animación de contadores,
   búsqueda en vivo, filtro por estado.
   ================================================================ */

/* ---------------------------------------------------------------
   1. MODO DALTÓNICO
--------------------------------------------------------------- */
function toggleColorblind() {
    const isActive = document.body.classList.toggle('colorblind-mode');
    const btn = document.getElementById('btn-colorblind');
    btn.setAttribute('aria-pressed', isActive);
    btn.querySelector('span:last-child') && (btn.lastChild.textContent = isActive ? ' Modo Normal' : ' Modo Daltónico');
    // Actualiza el texto del botón sin afectar el SVG
    const textNode = [...btn.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = isActive ? ' Modo Normal' : ' Modo Daltónico';
    // Persiste la preferencia en sessionStorage
    sessionStorage.setItem('colorblind', isActive ? '1' : '0');
}

/* ---------------------------------------------------------------
   2. ANIMACIÓN DE CONTADORES (count-up al cargar)
--------------------------------------------------------------- */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-val[data-target]');
    counters.forEach(el => {
        const target  = parseInt(el.dataset.target, 10);
        const decimal = el.dataset.decimal ? parseInt(el.dataset.decimal, 10) : 0;
        const suffix  = el.dataset.suffix  || '';
        const duration = 1200; // ms
        const steps    = 60;
        const stepVal  = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(stepVal * step, target);
            if (decimal) {
                // Para porcentajes como 99.9
                el.textContent = (current / Math.pow(10, decimal)).toFixed(decimal) + suffix;
            } else {
                el.textContent = Math.floor(current).toLocaleString('es-SV') + suffix;
            }
            if (step >= steps) {
                clearInterval(timer);
                el.textContent = decimal
                    ? (target / Math.pow(10, decimal)).toFixed(decimal) + suffix
                    : target.toLocaleString('es-SV') + suffix;
            }
        }, duration / steps);
    });
}

/* ---------------------------------------------------------------
   3. BÚSQUEDA EN VIVO (filtra filas por texto)
--------------------------------------------------------------- */
function initSearch() {
    const input   = document.getElementById('buscador-actas');
    const tbody   = document.getElementById('tbody-actas');
    const empty   = document.getElementById('empty-state');
    if (!input || !tbody) return;

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        filterTable(q, null, tbody, empty);
    });
}

/* ---------------------------------------------------------------
   4. FILTRO POR ESTADO
--------------------------------------------------------------- */
function initFilter() {
    const select = document.getElementById('filtro-estado');
    const tbody  = document.getElementById('tbody-actas');
    const empty  = document.getElementById('empty-state');
    const input  = document.getElementById('buscador-actas');
    if (!select || !tbody) return;

    select.addEventListener('change', () => {
        const estado = select.value;
        const q      = input ? input.value.trim().toLowerCase() : '';
        filterTable(q, estado === 'all' ? null : estado, tbody, empty);
    });
}

/* ---------------------------------------------------------------
   5. FUNCIÓN COMPARTIDA DE FILTRADO
--------------------------------------------------------------- */
function filterTable(query, estado, tbody, emptyEl) {
    const rows   = tbody.querySelectorAll('tr');
    let visible  = 0;

    rows.forEach(row => {
        const text       = row.textContent.toLowerCase();
        const badgeEl    = row.querySelector('[data-estado]');
        const rowEstado  = badgeEl ? badgeEl.dataset.estado : '';

        const matchQuery  = !query  || text.includes(query);
        const matchEstado = !estado || rowEstado === estado;

        if (matchQuery && matchEstado) {
            row.hidden = false;
            visible++;
        } else {
            row.hidden = true;
        }
    });

    if (emptyEl) emptyEl.hidden = visible > 0;
}

/* ---------------------------------------------------------------
   6. NAVEGACIÓN: resalta el ítem activo al hacer clic
--------------------------------------------------------------- */
function initNav() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        });
    });
}

/* ---------------------------------------------------------------
   7. RESTAURAR PREFERENCIA DE MODO DALTÓNICO
--------------------------------------------------------------- */
function restoreColorblind() {
    if (sessionStorage.getItem('colorblind') === '1') {
        document.body.classList.add('colorblind-mode');
        const btn = document.getElementById('btn-colorblind');
        if (btn) {
            btn.setAttribute('aria-pressed', 'true');
            const textNode = [...btn.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.textContent = ' Modo Normal';
        }
    }
}

/* ---------------------------------------------------------------
   8. ATAJO DE TECLADO — Alt+C activa modo daltónico
--------------------------------------------------------------- */
document.addEventListener('keydown', e => {
    if (e.altKey && e.key.toLowerCase() === 'c') {
        toggleColorblind();
    }
});

/* ---------------------------------------------------------------
   INIT — Ejecuta todo cuando el DOM esté listo
--------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    restoreColorblind();

    // Anima contadores sólo si el usuario no prefiere movimiento reducido
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
        animateCounters();
    } else {
        // Sin animación: muestra valores finales directamente
        document.querySelectorAll('.stat-val[data-target]').forEach(el => {
            const t = parseInt(el.dataset.target, 10);
            const d = el.dataset.decimal ? parseInt(el.dataset.decimal, 10) : 0;
            const s = el.dataset.suffix || '';
            el.textContent = d ? (t / Math.pow(10, d)).toFixed(d) + s : t.toLocaleString('es-SV') + s;
        });
    }

    initSearch();
    initFilter();
    initNav();
});
