//<!-- Catalog Dropdown Script -->
document.addEventListener('DOMContentLoaded', function() {
    const catalogToggleBtn = document.getElementById('catalogToggleBtn');
    const catalogMenu = document.querySelector('.catalog-menu');

    catalogToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = catalogMenu.hasAttribute('hidden');
    if (isHidden) {
        catalogMenu.removeAttribute('hidden');
        catalogToggleBtn.setAttribute('aria-expanded', 'true');
    } else {
        catalogMenu.setAttribute('hidden', '');
        catalogToggleBtn.setAttribute('aria-expanded', 'false');
    }
    });

    document.addEventListener('click', (e) => {
    if (!catalogToggleBtn.contains(e.target) && !catalogMenu.contains(e.target)) {
        catalogMenu.setAttribute('hidden', '');
        catalogToggleBtn.setAttribute('aria-expanded', 'false');
    }
    });

    const checkboxes = document.querySelectorAll('.catalog-menu input[type="checkbox"]');
    const catalogs = document.querySelectorAll('.catalogs .catalog');
    const catalogMap = {};
    catalogs.forEach(cat => {
    const label = cat.querySelector('.catalog-label').textContent.trim();
    catalogMap[label] = cat;
    });

    checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const catName = checkbox.getAttribute('data-catalog');
        const catalogDiv = catalogMap[catName];
        if (!catalogDiv) return;
        catalogDiv.classList.toggle('active', checkbox.checked);
    });
    });
});


//<!-- Anime Filtering & Rendering Script -->
document.addEventListener('DOMContentLoaded', () => {
    let allAnime = [];

    function showLogMessage() {
    const backdrop = document.getElementById('logBackdrop');
    if (backdrop) {
        backdrop.style.display = 'flex';  // Show the entire modal overlay
        document.body.classList.add('modal-open'); // prevent background scroll (optional)
    }
    }

    function renderAnimeList(animeList) {
    const container = document.getElementById('anime-section');
    container.innerHTML = '';

    // If after search have not found any anime so it show a message
    if (animeList.length === 0) {
        container.classList.remove('single-result'); // just in case
        container.innerHTML = `
        <div class="no-results">
            <img src="https://i.pinimg.com/736x/6c/0d/6e/6c0d6e129bda7d129968aab84d3af63c.jpg" alt="No Anime" class="no-results-img">
            <p>No anime found.</p>
        </div>`;
        return;
    }

    if (animeList.length === 1) {
        container.classList.add('single-result');
    } else {
        container.classList.remove('single-result');
    }

    animeList.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';

        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';

        const link = document.createElement('a');
        link.href = `animeDetail.html?id=${encodeURIComponent(anime.id)}`;

        const img = document.createElement('img');
        img.src = anime.image;
        img.className = 'anime-img';
        img.alt = anime.title;
        link.appendChild(img);

        wrapper.appendChild(link);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'anime-actions';

        const playBtn = document.createElement('button');
        playBtn.className = 'icon-button';
        playBtn.title = 'Play Now';
        playBtn.innerHTML = '<img src="icons/Play.png" alt="Play" class="icon-img">';
        playBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = `watchAnime.html?title=${encodeURIComponent(anime.title)}`;
        };

        const detailBtn = document.createElement('button');
        detailBtn.className = 'icon-button';
        detailBtn.title = 'View Anime Details';
        detailBtn.innerHTML = '<img src="icons/more-detail.png" alt="Detail" class="icon-img">';
        detailBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = `animeDetail.html?title=${encodeURIComponent(anime.title)}#details`;
        };

        const addBtn = document.createElement('button');
        addBtn.className = 'icon-button';
        addBtn.title = 'Add to Playlist';
        addBtn.innerHTML = '<img src="icons/add-to-watchlist.png" alt="Add" class="icon-img">';
        addBtn.onclick = (e) => {
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

        actions.appendChild(playBtn);
        actions.appendChild(detailBtn);
        actions.appendChild(addBtn);
        wrapper.appendChild(actions);

        const name = document.createElement('div');
        name.className = 'anime-title';
        name.textContent = anime.title;

        card.appendChild(wrapper);
        card.appendChild(name);
        container.appendChild(card);
    });
    }

    function getFilters() {
        const search = document.querySelector('.search-bar input').value.trim().toLowerCase();
        const selects = document.querySelectorAll('.catalog select');
        return {
            genre: selects[0].value,
            year: selects[1].value,
            region: selects[2].value,
            status: selects[3].value,
            sort: selects[4].value,
            search
        };
    }

    function filterAnime() {
    const { genre, year, region, status, sort, search } = getFilters();

    let filtered = allAnime.filter(anime => {
        if (search && !anime.title.toLowerCase().includes(search)) return false;
        if (genre !== 'All' && !(anime.genres && anime.genres.includes(genre))) return false;
        if (year !== 'All') {
        if (year === 'Before 2000' && !(anime.year < 2000)) return false;
        if (year !== 'Before 2000' && anime.year != year) return false;
        }
        if (region !== 'All' && anime.region !== region) return false;
        if (status !== 'All' && anime.status !== status) return false;
        return true;
    });

    if (sort === 'Popularity') filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    else if (sort === 'Newest') filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
    else if (sort === 'Rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    renderAnimeList(filtered);
    }

    fetch('Json file/allAnime.json')
    .then(response => response.json())
    .then(data => {
        allAnime = data;
        filterAnime();

        document.querySelector('.search-bar input').addEventListener('input', filterAnime);
        document.querySelectorAll('.catalog select').forEach(select => {
        select.addEventListener('change', filterAnime);
        });
    });
});

// message rendering scripts
function Message(Mss) {
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

// none login message
function showLogMessage() {
    document.getElementById('logBackdrop').style.display = 'flex';
    document.body.classList.add('modal-open');
}

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.log-message .close-btn');
    const backdrop = document.getElementById('logBackdrop');

    if (closeBtn && backdrop) {
        closeBtn.onclick = () => {
            backdrop.style.display = 'none';
            document.body.classList.remove('modal-open');
        };

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
            backdrop.style.display = 'none';
            document.body.classList.remove('modal-open');
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