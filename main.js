// ===== Esperar a que el DOM cargue =====
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // ===== Menú móvil =====
    const boutonMenu = document.getElementById('boutonMenu');
    const fermerMenu = document.getElementById('fermerMenu');
    const menuMobile = document.getElementById('menuMobile');
    const superpositionMenu = document.getElementById('superpositionMenu');

    function ouvrirMenuMobile() {
        menuMobile.classList.add('ouvert');
        superpositionMenu.classList.add('ouvert');
        document.body.style.overflow = 'hidden';
    }

    function fermerMenuMobile() {
        menuMobile.classList.remove('ouvert');
        superpositionMenu.classList.remove('ouvert');
        document.body.style.overflow = 'auto';
    }

    boutonMenu?.addEventListener('click', ouvrirMenuMobile);
    fermerMenu?.addEventListener('click', fermerMenuMobile);
    superpositionMenu?.addEventListener('click', fermerMenuMobile);

    if (document.querySelectorAll('.menu-mobile a')) {
        document.querySelectorAll('.menu-mobile a').forEach(lien => {
            lien.addEventListener('click', fermerMenuMobile);
        });
    }

    // ===== Función reutilizable para altura de tarjetas =====
    function setHeight(el, open) {
        const panel = el.querySelector('.servicio-detalles');
        const inner = el.querySelector('.servicio-detalles-inner');
        if (!panel || !inner) return;
        panel.style.height = open ? inner.getBoundingClientRect().height + 'px' : '0';
    }

    // ===== Toggle tarjetas =====
    document.querySelectorAll('[data-card]').forEach(card => {
        const btn = card.querySelector('[data-toggle]');
        let expanded = false;

        function toggleCard() {
            expanded = !expanded;
            btn?.setAttribute('aria-expanded', expanded);
            setHeight(card, expanded);
            btn?.querySelector('i')?.classList.toggle('fa-chevron-up', expanded);
            btn?.querySelector('i')?.classList.toggle('fa-chevron-down', !expanded);
            if (btn?.querySelector('span')) {
                btn.querySelector('span').textContent = expanded ? 'Ocultar' : 'Ver más';
            }
        }

        // Click en toda la tarjeta
        card.addEventListener('click', e => {
            if (!e.target.closest('a') && !e.target.closest('button')) toggleCard();
        });

        // Click en el botón
        btn?.addEventListener('click', e => {
            e.stopPropagation();
            toggleCard();
        });

        // Ajustar altura al redimensionar
        window.addEventListener('resize', () => { if (expanded) setHeight(card, true); });
    });

    // ===== Bottom Sheet =====
    const sheet = document.getElementById('sheet');
    const backdrop = document.getElementById('sheet-backdrop');
    const openBtn = document.getElementById('open-sheet');
    const closeXBtn = document.getElementById('sheet-close-x');

    function openSheet() {
        sheet.classList.add('open');
        backdrop.style.opacity = 1;
        backdrop.style.pointerEvents = 'auto';
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeSheet() {
        sheet.classList.remove('open');
        backdrop.style.opacity = 0;
        backdrop.style.pointerEvents = 'none';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    openBtn?.addEventListener('click', openSheet);
    closeXBtn?.addEventListener('click', closeSheet);
    backdrop?.addEventListener('click', closeSheet);
    window.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

    // ===== Drag para cerrar Bottom Sheet =====
    (function enableDrag() {
        if (!sheet) return;
        
        let startY = null, currentY = null, dragging = false;

        const start = y => { startY = y; dragging = true; sheet.style.transition = 'none'; };
        const move = y => {
            if (!dragging) return;
            currentY = y;
            sheet.style.transform = `translateY(${Math.max(0, currentY - startY)}px)`;
        };
        const end = () => {
            if (!dragging) return;
            sheet.style.transition = 'transform .35s ease';
            const dy = Math.max(0, (currentY ?? startY) - startY);
            if (dy > 120) closeSheet();
            sheet.style.transform = '';
            startY = currentY = dragging = null;
        };

        sheet.addEventListener('touchstart', e => start(e.touches[0].clientY));
        sheet.addEventListener('touchmove', e => move(e.touches[0].clientY));
        sheet.addEventListener('touchend', end);

        let mouseDown = false;
        sheet.addEventListener('mousedown', e => { mouseDown = true; start(e.clientY); });
        window.addEventListener('mousemove', e => { if (mouseDown) move(e.clientY); });
        window.addEventListener('mouseup', () => { if (mouseDown) { mouseDown = false; end(); } });
    })();

    // ===== Animación de partículas =====
    const canvas = document.getElementById("particles");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        const numParticles = 80;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                speed: Math.random() * 1 + 0.5,
                alpha: Math.random() * 0.6 + 0.3
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(52, 211, 153, ${p.alpha})`;
                ctx.fill();
                p.y -= p.speed;
                p.x += Math.sin(p.y * 0.02) * 0.3;
                if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ===== Sistema de Reseñas =====
    (function initReviews() {
        const list = document.querySelector('.reviews-guerlyne');
        if (!list) return;

        // evitar doble inicialización
        const containerWrapper = list.closest('.reviews-container-guerlyne') || list.parentElement;
        if (containerWrapper.dataset.reviewsInit === '1') return;
        containerWrapper.dataset.reviewsInit = '1';

        const cards = Array.from(list.querySelectorAll('.review-card-guerlyne'));
        if (!cards.length) return;

        // buscar los controles dentro del mismo bloque
        const prevBtn = containerWrapper.querySelector('.prev-btn-guerlyne');
        const nextBtn = containerWrapper.querySelector('.next-btn-guerlyne');
        let navDotsContainer = containerWrapper.querySelector('.nav-dots');

        // Si no existe nav-dots en HTML, lo creamos
        if (!navDotsContainer) {
            navDotsContainer = document.createElement('div');
            navDotsContainer.className = 'nav-dots';
            if (containerWrapper.querySelector('.reviews-nav-guerlyne')) {
                containerWrapper.querySelector('.reviews-nav-guerlyne').insertBefore(navDotsContainer, containerWrapper.querySelector('.reviews-nav-guerlyne').querySelector('.next-btn-guerlyne') || null);
            } else {
                containerWrapper.appendChild(navDotsContainer);
            }
        }

        let currentExpanded = null;

        /* helpers */
        function collapseCard(card) {
            if (!card) return;
            card.classList.remove('expanded');
            card.setAttribute('aria-expanded', 'false');
        }
        function expandCard(card) {
            if (!card) return;
            if (currentExpanded && currentExpanded !== card) collapseCard(currentExpanded);
            card.classList.add('expanded');
            card.setAttribute('aria-expanded', 'true');
            currentExpanded = card;
            // centrar en vista
            try { card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } catch(e) {}
            // asegurar foco para accesibilidad
            if (typeof card.focus === 'function') card.focus();
        }
        function toggleCard(card) {
            if (!card) return;
            if (card.classList.contains('expanded')) {
                collapseCard(card);
                currentExpanded = null;
            } else {
                expandCard(card);
            }
        }

        // Delegación: abrir tarjeta al hacer click en .read-more o en la tarjeta
        list.addEventListener('click', (e) => {
            const readMore = e.target.closest('.read-more-guerlyne');
            const card = e.target.closest('.review-card-guerlyne');
            if (readMore && card) {
                e.stopPropagation();
                toggleCard(card);
                return;
            }
            if (card && !e.target.closest('a, button')) {
                toggleCard(card);
            }
        });

        // Keyboard support & make focusable
        cards.forEach(c => {
            if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '0');
            c.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCard(c);
                }
            });
        });

        // Si el usuario hace clic fuera del bloque, colapsar
        document.addEventListener('click', (e) => {
            if (!list.contains(e.target) && currentExpanded) {
                collapseCard(currentExpanded);
                currentExpanded = null;
            }
        });

        // Métricas y dots
        function computeMetrics() {
            const firstCard = cards[0];
            const cardRect = firstCard ? firstCard.getBoundingClientRect() : { width: 260 };
            const style = getComputedStyle(list);
            const gap = parseFloat(style.gap || style.columnGap || '16') || 16;
            const cardFull = cardRect.width + gap;
            const visibleCount = Math.max(1, Math.floor(list.clientWidth / cardFull));
            return { cardWidth: cardRect.width, gap, cardFull, visibleCount };
        }

        function makeDots() {
            navDotsContainer.innerHTML = '';
            const { visibleCount } = computeMetrics();
            const pages = Math.max(1, Math.ceil(cards.length / visibleCount));
            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('div');
                dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
                dot.dataset.page = i;
                dot.style.cursor = 'pointer';
                dot.addEventListener('click', () => {
                    const { cardFull } = computeMetrics();
                    const left = i * visibleCount * cardFull;
                    list.scrollTo({ left, behavior: 'smooth' });
                });
                navDotsContainer.appendChild(dot);
            }
        }

        function updateDotsOnScroll() {
            const { cardFull, visibleCount } = computeMetrics();
            const scrollLeft = list.scrollLeft;
            const page = Math.round(scrollLeft / (visibleCount * cardFull));
            const dots = Array.from(navDotsContainer.children);
            dots.forEach((d, i) => d.classList.toggle('active', i === page));
        }

        function pageScroll(direction = 1) {
            const { cardFull, visibleCount } = computeMetrics();
            const amount = Math.max(1, visibleCount) * cardFull;
            list.scrollBy({ left: amount * direction, behavior: 'smooth' });
        }

        if (nextBtn) nextBtn.addEventListener('click', () => pageScroll(1));
        if (prevBtn) prevBtn.addEventListener('click', () => pageScroll(-1));

        // scroll handler con throttle (requestAnimationFrame)
        let raf = null;
        list.addEventListener('scroll', () => {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                updateDotsOnScroll();
                if (currentExpanded) {
                    const r = currentExpanded.getBoundingClientRect();
                    const l = list.getBoundingClientRect();
                    const visibleX = Math.max(0, Math.min(r.right, l.right) - Math.max(r.left, l.left));
                    if (visibleX < r.width * 0.28) {
                        collapseCard(currentExpanded);
                        currentExpanded = null;
                    }
                }
            });
        });

        // responsive
        window.addEventListener('resize', () => {
            makeDots();
            updateDotsOnScroll();
            // si una carta está expandida, reajustar su scrollIntoView
            if (currentExpanded) currentExpanded.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });

        // init
        makeDots();
        updateDotsOnScroll();

        // permitir cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Escape' || e.key === 'Esc') && currentExpanded) {
                collapseCard(currentExpanded);
                currentExpanded = null;
            }
        });
    })();

    // ===== Reproductor de audio avanzado =====
    (function initAudioPlayer() {
        const audio = new Audio();
        audio.id = 'audio-barber-player';
        document.body.appendChild(audio);

        const listLinks = Array.from(document.querySelectorAll('#audio-list li a'));
        const title = document.getElementById('track-title');
        const sectionLabel = document.getElementById('section-text');
        const playBtn = document.getElementById('audio-play');
        const pauseBtn = document.getElementById('audio-pause');
        const progress = document.getElementById('audio-progress');
        const currentTimeEl = document.getElementById('audio-current');
        const durationEl = document.getElementById('audio-duration');
        const jumpSilenceBtn = document.getElementById('jump-silence');
        const nextAudioContainer = document.getElementById('next-audio-container');
        const nextAudioBtn = document.getElementById('next-audio-btn');

        const currentPage = window.location.pathname.split("/").pop() || 'index.html';
        const pageSilenceSettings = {
            'index.html': 5,
            'services.html': 3,
            'ubicacion.html': 4,
            'agenda.html': 6
        };

        let silenceJump = pageSilenceSettings[currentPage] || 5;
        if (jumpSilenceBtn) jumpSilenceBtn.textContent = `Saltar intro (${silenceJump}s)`;

        // Filtrar enlaces válidos
        const validLinks = listLinks.filter(link => {
            const href = link.getAttribute('href');
            return href && href.startsWith(currentPage);
        });

        let currentIndex = 0;

        function toggleNextAudioButton(show) {
            if (!nextAudioContainer) return;
            if (show) nextAudioContainer.classList.add('visible');
            else nextAudioContainer.classList.remove('visible');
        }

        function loadTrackByIndex(index) {
            if (index < 0 || index >= validLinks.length) return false;

            const link = validLinks[index];
            const src = link.dataset ? link.dataset.src : null;
            if (!src) return false;

            if (link.dataset.silence) {
                silenceJump = parseInt(link.dataset.silence);
                if (jumpSilenceBtn) jumpSilenceBtn.textContent = `Saltar intro (${silenceJump}s)`;
            }

            audio.src = src;
            if (title) title.textContent = link.textContent;

            // Actualizar etiqueta de sección
            if (sectionLabel) sectionLabel.textContent = link.dataset.section || 'Seleccionar';

            currentIndex = index;
            toggleNextAudioButton(false);
            return true;
        }

        if (jumpSilenceBtn) {
            jumpSilenceBtn.addEventListener('click', () => {
                if (audio.src) {
                    audio.currentTime = silenceJump;
                    if (audio.paused) audio.play();
                }
            });
        }

        listLinks.forEach((link, idx) => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith(currentPage)) {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    const realIndex = validLinks.findIndex(l => l.getAttribute('href') === href);

                    if (realIndex !== -1 && loadTrackByIndex(realIndex)) {
                        audio.play();
                        if (playBtn) playBtn.style.display = 'none';
                        if (pauseBtn) pauseBtn.style.display = 'inline';

                        const targetId = href.split('#')[1];
                        const target = document.getElementById(targetId);
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                audio.play();
                playBtn.style.display = 'none';
                if (pauseBtn) pauseBtn.style.display = 'inline';
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                audio.pause();
                pauseBtn.style.display = 'none';
                if (playBtn) playBtn.style.display = 'inline';
            });
        }

        const nextBtn = document.getElementById('audio-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < validLinks.length - 1) {
                    loadTrackByIndex(currentIndex + 1);
                    audio.play();
                    if (playBtn) playBtn.style.display = 'none';
                    if (pauseBtn) pauseBtn.style.display = 'inline';
                    const href = validLinks[currentIndex].getAttribute('href');
                    const targetId = href.split('#')[1];
                    const target = document.getElementById(targetId);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                } else {
                    toggleNextAudioButton(true);
                    setTimeout(() => { toggleNextAudioButton(false); }, 5000);
                }
            });
        }

        const prevBtn = document.getElementById('audio-prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    loadTrackByIndex(currentIndex - 1);
                    audio.play();
                    if (playBtn) playBtn.style.display = 'none';
                    if (pauseBtn) pauseBtn.style.display = 'inline';
                    const href = validLinks[currentIndex].getAttribute('href');
                    const targetId = href.split('#')[1];
                    const target = document.getElementById(targetId);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (nextAudioBtn) {
            nextAudioBtn.addEventListener('click', () => {
                let nextAudioUrl = '';
                switch(currentPage) {
                    case 'info.html': nextAudioUrl = 'services.html#section2'; break;
                    case 'services.html': nextAudioUrl = 'info.html#promocion'; break;
                    case 'ubicacion.html': nextAudioUrl = 'agenda.html#home'; break;
                    case 'agenda.html': nextAudioUrl = 'about.html#section1'; break;
                    case 'about.html': nextAudioUrl = 'index.html#home'; break;
                    default: nextAudioUrl = 'index.html#home';
                }
                window.location.href = nextAudioUrl;
            });
        }

        audio.addEventListener('timeupdate', () => {
            if (audio.duration && isFinite(audio.duration)) {
                if (progress) progress.value = (audio.currentTime / audio.duration) * 100;
                if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
                if (durationEl) durationEl.textContent = formatTime(audio.duration);
            }
        });

        if (progress) {
            progress.addEventListener('input', () => {
                if (audio.duration && isFinite(audio.duration)) {
                    audio.currentTime = (progress.value / 100) * audio.duration;
                }
            });
        }

        function formatTime(sec) {
            if (isNaN(sec) || !isFinite(sec)) return '0:00';
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        if (validLinks.length > 0) {
            loadTrackByIndex(0);
            audio.addEventListener('play', () => {
                const currentLink = validLinks[currentIndex];
                const skip = parseInt(currentLink.dataset.skip) || 0;
                if (skip > 0 && audio.currentTime < skip) {
                    audio.currentTime = skip;
                }
            });
            if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                const target = document.getElementById(targetId);
                if (target) setTimeout(() => { target.scrollIntoView({ behavior: 'smooth' }); }, 500);
            }
        }

        document.querySelectorAll("a[href^='#']").forEach(link => {
            link.addEventListener("click", function(e) {
                e.preventDefault();
                const targetId = this.getAttribute("href").substring(1);
                const target = document.getElementById(targetId);
                if (target) target.scrollIntoView({ behavior: "smooth" });
            });
        });

        // Botones de saltar silencio adicionales
        document.querySelectorAll('.jump-silence-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const skipSeconds = parseInt(btn.dataset.skip) || 5;
                if(audio.src){
                    audio.currentTime = skipSeconds;
                    if(audio.paused) audio.play();
                }
            });
        });

        // Aumenta margin B al llegar al footer 
        const audioPlayer = document.querySelector(".audio-player-container");
        const footer = document.querySelector("footer");

        if (audioPlayer && footer) {
            const baseBottom = parseInt(getComputedStyle(audioPlayer).bottom) || 0;
            const extra = 95; // el margen que quieres al aparecer el footer

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        audioPlayer.style.bottom = (baseBottom + extra) + "px";
                    } else {
                        audioPlayer.style.bottom = baseBottom + "px";
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(footer);
        }
    })();
});