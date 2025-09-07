    // Funcionalidad para el menú móvil
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
    
    boutonMenu.addEventListener('click', ouvrirMenuMobile);
    fermerMenu.addEventListener('click', fermerMenuMobile);
    superpositionMenu.addEventListener('click', fermerMenuMobile);
    
    // Cerrar menú al hacer clic en un enlace
    const liensMenu = document.querySelectorAll('.menu-mobile a');
    liensMenu.forEach(lien => {
      lien.addEventListener('click', fermerMenuMobile);
    });
    
   

    // ===== Scripts de services.html =====
    // ===== Despliegue inline en tarjetas 1 y 2 =====
    function setHeight(el, open){
        const panel = el.querySelector('.servicio-detalles');
        const inner = el.querySelector('.servicio-detalles-inner');
        if(!panel || !inner) return;
        if(open){
            const h = inner.getBoundingClientRect().height;
            panel.style.height = h + 'px';
        }else{
            panel.style.height = 0;
        }
    }

    document.querySelectorAll('[data-card]').forEach(card=>{
        const btn = card.querySelector('[data-toggle]');
        btn?.addEventListener('click', e=>{
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            setHeight(card, !expanded);
            btn.querySelector('i')?.classList.toggle('fa-chevron-up');
            btn.querySelector('i')?.classList.toggle('fa-chevron-down');
            btn.querySelector('span').textContent = expanded ? 'Ver más' : 'Ocultar';
        });
        // Ajustar altura al redimensionar
        window.addEventListener('resize', ()=>{
            const isOpen = btn?.getAttribute('aria-expanded') === 'true';
            if(isOpen) setHeight(card, true);
        });
    });

    // ===== Toggle en toda la tarjeta =====
    function setHeight(el, open){
        const panel = el.querySelector('.servicio-detalles');
        const inner = el.querySelector('.servicio-detalles-inner');
        if(!panel || !inner) return;
        if(open){
            const h = inner.getBoundingClientRect().height;
            panel.style.height = h + 'px';
        } else {
            panel.style.height = 0;
        }
    }

    document.querySelectorAll('[data-card]').forEach(card=>{
        const btn = card.querySelector('[data-toggle]');
        let expanded = false;

        function toggleCard() {
            expanded = !expanded;
            btn?.setAttribute('aria-expanded', String(expanded));
            setHeight(card, expanded);
            btn?.querySelector('i')?.classList.toggle('fa-chevron-up', expanded);
            btn?.querySelector('i')?.classList.toggle('fa-chevron-down', !expanded);
            if (btn?.querySelector('span')) {
                btn.querySelector('span').textContent = expanded ? 'Ocultar' : 'Ver más';
            }
        }

        // Click en toda la tarjeta 🔥
        card.addEventListener('click', e=>{
            // Evitar que links internos se disparen
            if(e.target.closest('a') || e.target.closest('button')) return;
            toggleCard();
        });

        // El botón sigue funcionando también
        btn?.addEventListener('click', e=>{
            e.stopPropagation(); // evita doble trigger
            toggleCard();
        });

        // Ajustar altura al redimensionar
        window.addEventListener('resize', ()=>{
            if(expanded) setHeight(card, true);
        });
    });

    // ===== Bottom Sheet =====
    const sheet = document.getElementById('sheet');
    const backdrop = document.getElementById('sheet-backdrop');
    const openBtn = document.getElementById('open-sheet');
    const closeXBtn = document.getElementById('sheet-close-x');

    function openSheet(){
        sheet.classList.add('open');
        backdrop.style.opacity = 1; backdrop.style.pointerEvents = 'auto';
        backdrop.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
    }
    function closeSheet(){
        sheet.classList.remove('open');
        backdrop.style.opacity = 0; backdrop.style.pointerEvents = 'none';
        backdrop.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
    }

    openBtn?.addEventListener('click', openSheet);
    closeXBtn?.addEventListener('click', closeSheet);
    backdrop?.addEventListener('click', closeSheet);

    // Cerrar con ESC
    window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeSheet(); });

    // ===== Mejora: soporte de drag para cerrar en móviles (gesto hacia abajo) =====
    (function enableDrag(){
        let startY=null, currentY=null, dragging=false;
        const start = (y)=>{startY=y;dragging=true;sheet.style.transition='none'};
        const move = (y)=>{
            if(!dragging) return;
            currentY = y; const dy = Math.max(0, currentY - startY);
            sheet.style.transform = `translateY(${dy}px)`;
        };
        const end = ()=>{
            if(!dragging) return;
            sheet.style.transition='transform .35s ease';
            const dy = Math.max(0, (currentY??startY) - startY);
            if(dy > 120){ closeSheet(); setTimeout(()=>{sheet.style.transform='';}, 350); }
            else { sheet.style.transform=''; }
            startY=null; currentY=null; dragging=false;
        };
        // Listeners
        sheet.addEventListener('touchstart', e=>start(e.touches[0].clientY));
        sheet.addEventListener('touchmove', e=>move(e.touches[0].clientY));
        sheet.addEventListener('touchend', end);
        // Opcional: drag con mouse en desktop
        let mouseDown=false;
        sheet.addEventListener('mousedown', e=>{ mouseDown=true; start(e.clientY); });
        window.addEventListener('mousemove', e=>{ if(mouseDown) move(e.clientY); });
        window.addEventListener('mouseup', ()=>{ if(mouseDown){ mouseDown=false; end(); } });
    })();

    // Animación de partículas (desde services.html)
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");

    let particles = [];
    const numParticles = 80;

    // Ajustar tamaño al de la ventana
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Crear partículas iniciales
    for (let i = 0; i < numParticles; i++) {
        particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * canvas.height, // desde abajo
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5,
        alpha: Math.random() * 0.6 + 0.3
        });
    }

    // Animación
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${p.alpha})`; // verde con transparencia
        ctx.fill();

        // Movimiento hacia arriba
        p.y -= p.speed;
        p.x += Math.sin(p.y * 0.02) * 0.3; // pequeño movimiento lateral

        // Reiniciar cuando salga arriba
        if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
        }
        }

        requestAnimationFrame(animate);
    }

    animate();


    // === Variables y selectores ===
    const reviewsContainer = document.querySelector('.reviews-guerlyne');
    const prevBtn = document.querySelector('.prev-btn-guerlyne');
    const nextBtn = document.querySelector('.next-btn-guerlyne');
    const scrollProgress = document.querySelector('.scroll-progress');
    const navDots = document.querySelectorAll('.nav-dot');
    const reviewCards = document.querySelectorAll('.review-card-guerlyne');

    // Expandir/contraer reseñas
    document.querySelectorAll('.review-card-guerlyne').forEach(card => {
      const moreBtn = card.querySelector('.read-more-guerlyne');
      const text = card.querySelector('p');
      const originalText = text.textContent;

      if (originalText.length > 150) {
        const toggleText = () => {
          card.classList.toggle('expanded');
          if (card.classList.contains('expanded')) {
            moreBtn.innerHTML = 'Leer menos <i class="fas fa-chevron-up"></i>';
            moreBtn.classList.add('expanded');
          } else {
            moreBtn.innerHTML = 'Leer más <i class="fas fa-chevron-down"></i>';
            moreBtn.classList.remove('expanded');
          }
        };

        moreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleText();
        });

        card.addEventListener('click', (e) => {
          if (e.target !== moreBtn && !moreBtn.contains(e.target)) {
            toggleText();
          }
        });
      } else {
        moreBtn.style.display = 'none';
      }
    });

    // Progreso de scroll + dots
    function updateScrollProgress() {
      const scrollLeft = reviewsContainer.scrollLeft;
      const scrollWidth = reviewsContainer.scrollWidth - reviewsContainer.clientWidth;
      const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
      scrollProgress.style.width = progress + '%';

      const cardWidth = 324; // ancho estimado (card + gap)
      const currentIndex = Math.min(Math.floor(scrollLeft / cardWidth), navDots.length - 1);

      navDots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
    }

    nextBtn.addEventListener('click', () => reviewsContainer.scrollBy({ left: 324, behavior: 'smooth' }));
    prevBtn.addEventListener('click', () => reviewsContainer.scrollBy({ left: -324, behavior: 'smooth' }));

    navDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        reviewsContainer.scrollTo({ left: index * 324, behavior: 'smooth' });
      });
    });

    reviewsContainer.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress);
    // Init
    updateScrollProgress();

    // IntersectionObserver para activar animaciones sólo al entrar en viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.style.animationPlayState = 'running';
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.review-card-guerlyne').forEach(card => observer.observe(card));

    // Drag scroll (mouse)
    let isDown=false, startX, scrollLeft;
    reviewsContainer.addEventListener('mousedown',(e)=>{isDown=true;startX=e.pageX - reviewsContainer.offsetLeft;scrollLeft=reviewsContainer.scrollLeft;reviewsContainer.style.cursor='grabbing'});
    window.addEventListener('mouseup',()=>{isDown=false;reviewsContainer.style.cursor='auto'});
    reviewsContainer.addEventListener('mousemove',(e)=>{ if(!isDown) return; e.preventDefault(); const x = e.pageX - reviewsContainer.offsetLeft; const walk = (x - startX) * 2; reviewsContainer.scrollLeft = scrollLeft - walk; });