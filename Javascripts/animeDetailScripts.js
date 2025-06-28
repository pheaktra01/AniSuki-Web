// ============= rating mechanice scripts ==============
// Simple localStorage-based rating system
function getRatingData() {
    const data = localStorage.getItem('frieren-rating');
    return data ? JSON.parse(data) : { sum: 0, count: 0 };
}
function setRatingData(sum, count) {
    localStorage.setItem('frieren-rating', JSON.stringify({ sum, count }));
}

function updateRatingDisplay() {
    const { sum, count } = getRatingData();
    const avg = count ? (sum / count).toFixed(2) : '9.1';
    document.getElementById('average-rating').textContent = `⭐ ${avg}`;
    document.getElementById('rating-count').textContent = `(${count} vote${count === 1 ? '' : 's'})`;
}

updateRatingDisplay();

// Modal logic
document.getElementById('open-rating').onclick = function() {
    document.getElementById('rating-modal').style.display = 'flex';
    document.getElementById('rating-message').textContent = '';
    highlightStars(0);
};

document.getElementById('close-rating').onclick = function() {
    document.getElementById('rating-modal').style.display = 'none';
};

window.onclick = function(e) {
    if (e.target === document.getElementById('rating-modal')) {
        document.getElementById('rating-modal').style.display = 'none';
    }
};

// Star rating logic
let selectedRating = 0;

function highlightStars(n) {
    document.querySelectorAll('#star-container .star').forEach((star, i) => {
        star.style.color = i < n ? '#FFD700' : '#ccc';
    });
}
document.querySelectorAll('#star-container .star').forEach(star => {
    star.onmouseover = function() {
        highlightStars(Number(star.dataset.value));
    };

    star.onmouseout = function() {
        highlightStars(selectedRating);
    };

    star.onclick = function() {
        selectedRating = Number(star.dataset.value);
        highlightStars(selectedRating);
    };
});

document.getElementById('submit-rating').onclick = function() {
    if (!selectedRating) {
        document.getElementById('rating-message').textContent = 'Please select a rating!';
        return;
    }

    // Prevent multiple votes per session
    if (sessionStorage.getItem('frieren-rated')) {
        document.getElementById('rating-message').textContent = 'You have already rated!';
        return;
    }

    const { sum, count } = getRatingData();
    setRatingData(sum + selectedRating, count + 1);
    sessionStorage.setItem('frieren-rated', '1');
    updateRatingDisplay();
    document.getElementById('rating-message').textContent = 'Thank you for rating!';
    setTimeout(() => {
        document.getElementById('rating-modal').style.display = 'none';
    }, 1200);
};


// -- ============= Add to Watchlist Script ========================== -->
let isAdded = false;
const addBtn = document.getElementById('addBtn');
let anime = { title: "Frieren: Beyond Journey’s End" }; // Default fallback

// Try to fetch anime title from Anime.json if available
fetch('Json file/Anime.json')
    .then(res => res.json())
    .then(data => {
        if (data && data[0] && data[0].title) {
            anime.title = data[0].title;
        }
    })
    .catch(() => { /* fallback to default title */ });

addBtn.onclick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!localStorage.getItem('isLoggedIn')) {
        showLogMessage();
        return;
    }

    let playlist = JSON.parse(localStorage.getItem('playlist') || '[]');
    const inPlaylist = playlist.some(item => item.title === anime.title);

    if (!inPlaylist) {
        playlist.push(anime);
        localStorage.setItem('playlist', JSON.stringify(playlist));
        addBtn.classList.add('added-to-playlist');
        addBtn.style.backgroundColor = '#8806CE';
        Message(`✅ Added "${anime.title}" to your playlist!`);
    } else {
        playlist = playlist.filter(item => item.title !== anime.title);
        localStorage.setItem('playlist', JSON.stringify(playlist));
        addBtn.classList.remove('added-to-playlist');
        addBtn.style.backgroundColor = '';
        Message(`✅ Removed "${anime.title}" from your playlist.`);
    }
};

function Messages(Mss) {
    const message = document.createElement('div');
    message.textContent = Mss;
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.background = '#8806CE95';
    message.style.color = '#fff';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '8px';
    message.style.zIndex = '9999';
    message.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 1500);
}


// ================== Toggle Tabs or Tap action =========================
document.getElementById('overview-tab').addEventListener('click', function () {
    document.querySelector('.overview').style.display = 'flex';
    document.querySelector('.episodes').style.display = 'none';
    document.querySelector('.characters').style.display = 'none';

    this.classList.add('active-tab');
    document.getElementById('episodes-tab').classList.remove('active-tab');
    document.getElementById('character-tab').classList.remove('active-tab');
});

document.getElementById('episodes-tab').addEventListener('click', function () {
    document.querySelector('.overview').style.display = 'none';
    document.querySelector('.characters').style.display = 'none';
    document.querySelector('.episodes').style.display = 'block';

    this.classList.add('active-tab');
    document.getElementById('overview-tab').classList.remove('active-tab');
    document.getElementById('character-tab').classList.remove('active-tab');
});

document.getElementById('character-tab').addEventListener('click', function () {
    document.querySelector('.overview').style.display = 'none';
    document.querySelector('.episodes').style.display = 'none';
    document.querySelector('.characters').style.display = 'block';

    this.classList.add('active-tab');
    document.getElementById('overview-tab').classList.remove('active-tab');
    document.getElementById('episodes-tab').classList.remove('active-tab');
});

addAnimeSection("Json file/recommendAnime.json", "anime-section");
addCharacterSection("Json file/characters.json", "character-section");

// ============= read all episodes from json file ===============
fetch('Json file/Anime.json')
    .then(res => res.json())
    .then(data => {
        const anime = data[0];
        const episodeCount = parseInt(anime.episode, 10);
        const episodeList = document.querySelector('.episode-list');
        episodeList.innerHTML = '';

        // Create "Trailer" link
        const trailerLink = document.createElement('a');
        trailerLink.href = 'watchAnime.html?episode=trailer';
        trailerLink.className = 'episode-button';
        trailerLink.textContent = '▶ Trailer';
        episodeList.appendChild(trailerLink);

        // Create episode links
        for (let i = 0; i < episodeCount; i++) {
        const episodeLink = document.createElement('a');
        episodeLink.href = `watchAnime.html?episode=${i + 1}`;
        episodeLink.className = 'episode-button';
        episodeLink.textContent = `EP: ${i + 1} ${anime.episodes ? anime.episodes[i] || '' : ''}`;
        episodeList.appendChild(episodeLink);
        }
})
.catch(err => console.error(err));


// ========================= none login scripts =====================
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


// =============== footer scripts =================
fetch('footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
});