// Reproductor de audio avanzado (original + libellé section-text)
document.addEventListener("DOMContentLoaded", () => {
    const audio = new Audio();
    audio.id = 'audio-barber-player';
    document.body.appendChild(audio);

    const listLinks = Array.from(document.querySelectorAll('#audio-list li a'));
    const title = document.getElementById('track-title');
    const sectionLabel = document.getElementById('section-text'); // <-- juste ajouté
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
    jumpSilenceBtn.textContent = `Saltar intro (${silenceJump}s)`;

    // le filtrage reste inchangé
    const validLinks = listLinks.filter(link => {
        const href = link.getAttribute('href');
        return href && href.startsWith(currentPage);
    });

    let currentIndex = 0;

    function toggleNextAudioButton(show) {
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
            jumpSilenceBtn.textContent = `Saltar intro (${silenceJump}s)`;
        }

        audio.src = src;
        title.textContent = link.textContent;

        // <-- nouvelle ligne : maj du libellé
        if (sectionLabel) sectionLabel.textContent = link.dataset.section || 'Seleccionar';

        currentIndex = index;
        toggleNextAudioButton(false);
        return true;
    }

    jumpSilenceBtn.addEventListener('click', () => {
        if (audio.src) {
            audio.currentTime = silenceJump;
            if (audio.paused) audio.play();
        }
    });

    listLinks.forEach((link, idx) => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith(currentPage)) {
                e.preventDefault();
                const href = link.getAttribute('href');
                const realIndex = validLinks.findIndex(l => l.getAttribute('href') === href);

                if (realIndex !== -1 && loadTrackByIndex(realIndex)) {
                    audio.play();
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'inline';

                    const targetId = href.split('#')[1];
                    const target = document.getElementById(targetId);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    playBtn.addEventListener('click', () => {
        audio.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline';
    });

    pauseBtn.addEventListener('click', () => {
        audio.pause();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'inline';
    });

    document.getElementById('audio-next').addEventListener('click', () => {
        if (currentIndex < validLinks.length - 1) {
            loadTrackByIndex(currentIndex + 1);
            audio.play();
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline';
            const href = validLinks[currentIndex].getAttribute('href');
            const targetId = href.split('#')[1];
            const target = document.getElementById(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else {
            toggleNextAudioButton(true);
            setTimeout(() => { toggleNextAudioButton(false); }, 5000);
        }
    });

    document.getElementById('audio-prev').addEventListener('click', () => {
        if (currentIndex > 0) {
            loadTrackByIndex(currentIndex - 1);
            audio.play();
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline';
            const href = validLinks[currentIndex].getAttribute('href');
            const targetId = href.split('#')[1];
            const target = document.getElementById(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    });

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

    audio.addEventListener('timeupdate', () => {
        if (audio.duration && isFinite(audio.duration)) {
            progress.value = (audio.currentTime / audio.duration) * 100;
            currentTimeEl.textContent = formatTime(audio.currentTime);
            durationEl.textContent = formatTime(audio.duration);
        }
    });

    progress.addEventListener('input', () => {
        if (audio.duration && isFinite(audio.duration)) {
            audio.currentTime = (progress.value / 100) * audio.duration;
        }
    });

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
});

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

if (footer) {
  observer.observe(footer);
}
