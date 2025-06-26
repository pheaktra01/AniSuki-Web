// load video for the landing page or the hero section
let animeList = [];
let currentIndex = 0;
function loadAnime(index) {
    const anime = animeList[index];
    const video = document.getElementById('heroVideo');
    video.src = anime.video;
    video.load();
    video.play();
    document.getElementById('animeTag').textContent = anime.tag;
    document.getElementById('animeTitle').textContent = anime.title;
    document.getElementById('animeRelease').textContent = anime.release;
    document.getElementById('animeDescription').textContent = anime.description;
}

fetch('Json file/landingAnime.json')
    .then(response => response.json())
    .then(data => {
    animeList = data;
    currentIndex = Math.floor(Math.random() * animeList.length);
    loadAnime(currentIndex);
    document.getElementById('heroVideo').addEventListener('ended', () => {
        currentIndex = (currentIndex + 1) % animeList.length;
        loadAnime(currentIndex);
    });
});

// scroll down scroll bar mechanique
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (window.scrollY > 20) {
    scrollIndicator.style.opacity = '0';
    }
});

// mute and un mute in landing page mechanique
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('heroVideo');
    const volumeToggle = document.getElementById('volumeToggle');
    const volumeIcon = document.getElementById('volumeIcon');
    function updateIcon() {
    volumeIcon.textContent = video.muted ? '🔇' : '🔊';
    }
    volumeToggle.addEventListener('click', function () {
    video.muted = !video.muted;
    updateIcon();
    });
    // Update icon on load
    updateIcon();
});

// none login permissing message
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.log-message .close-btn');
    const backdrop = document.querySelector('.log-backdrop');

    if (closeBtn && backdrop) {
        closeBtn.onclick = () => {
            backdrop.style.display = 'none';
            document.body.classList.remove('modal-open');
        };
    }

    // Optional: close modal if user clicks outside the modal box
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            backdrop.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
});

  //<!-- ======== login effect script ============ -->
if (!localStorage.getItem('isLoggedIn')) {
    document.getElementById('history-section').style.display = 'none';
} else {
    document.getElementById('history-section').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const watchlistLink = document.getElementById('watchlist');

    if (watchlistLink) {
        watchlistLink.addEventListener('click', function (e) {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        if (!localStorage.getItem('isLoggedIn')) {
            e.preventDefault(); // block navigation
            showLogMessage();   // your custom toast or popup
        }
        });
    }
});

// footer scripts
fetch('footer.html')
    .then(response => response.text())
    .then(html => {
    document.getElementById('footer').innerHTML = html;
});