// load anime episodes and video section
fetch('Json file/Anime.json')
.then(res => res.json())
.then(data => {
    const anime = data[0];
    const episodeCount = parseInt(anime.episode, 10);
    const episodeList = document.querySelector('.episode-list');
    episodeList.innerHTML = '';

    const video = document.querySelector('video');

    // Create "Trailer" button
    const trailerBtn = document.createElement('button');
    trailerBtn.className = 'episode-button active';
    trailerBtn.textContent = '▶ Trailer';
    episodeList.appendChild(trailerBtn);

    // Load trailer by default
    const trailerSrc = new URL(anime.trailer, window.location.href).href;
    video.src = trailerSrc;
    video.load();

    trailerBtn.addEventListener('click', () => {
    const currentSrc = video.currentSrc;
    if (currentSrc === trailerSrc) return; // Already playing trailer

    document.querySelector('.episode-button.active')?.classList.remove('active');
    trailerBtn.classList.add('active');
    video.src = trailerSrc;
    video.load();
    video.play();
});

// Create episode buttons
for (let i = 0; i < episodeCount; i++) {
const btn = document.createElement('button');
btn.className = 'episode-button';
btn.textContent = `EP: ${i + 1} ${anime.episodes[i] || ''}`;
episodeList.appendChild(btn);

const videoSrc = new URL(anime.video.replace('${episodeNumber}', i + 1), window.location.href).href;

    btn.addEventListener('click', () => {
        const currentSrc = video.currentSrc;
        if (currentSrc === videoSrc) return; // Already playing this episode

        document.querySelector('.episode-button.active')?.classList.remove('active');
        btn.classList.add('active');
        video.src = videoSrc;
        video.load();
        video.play();
    });
    }
})
.catch(err => console.error(err));

// none login message 
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

// footer
fetch('footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
});