// show empty state if there no card in history or watchlist
document.addEventListener('DOMContentLoaded', function () {
    const historyContainer = document.querySelector('.animehistory');
    const historyEmpty = document.getElementById('history-empty');

    const watchlistContainer = document.getElementById('watchlist-content');
    const watchlistEmpty = document.getElementById('watchlist-empty');

    function updateEmptyStates() {
        const historyContainer = document.querySelector('.animehistory');
        const historyEmpty = document.getElementById('history-empty');

        const watchlistContainer = document.getElementById('watchlist-content');
        const watchlistEmpty = document.getElementById('watchlist-empty');

        // Check History
        if (!historyContainer.querySelector('.history-card')) {
            historyEmpty.style.display = 'block';
        } else {
            historyEmpty.style.display = 'none';
        }

        // Check Watchlist
        if (!watchlistContainer.querySelector('.watchlist-card')) {
            watchlistEmpty.style.display = 'block';
        } else {
            watchlistEmpty.style.display = 'none';
        }
    }

    updateEmptyStates(); // Initial check

    // Tab switching
    document.getElementById('watchlist-tab').onclick = function () {
        this.classList.add('active');
        document.getElementById('history-tab').classList.remove('active');
        document.getElementById('watchlist-content').style.display = '';
        document.getElementById('history-content').style.display = 'none';
    };

    document.getElementById('history-tab').onclick = function () {
        this.classList.add('active');
        document.getElementById('watchlist-tab').classList.remove('active');
        document.getElementById('history-content').style.display = '';
        document.getElementById('watchlist-content').style.display = 'none';
    };

    // Delete functionality
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
        const card = btn.closest('.history-card');
        if (card) {
            card.remove();
            updateEmptyStates();
        }
        });
    });

    // Toggle more options
    document.querySelectorAll('.more-options').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const menu = btn.parentElement.querySelector('.more-menu');
            document.querySelectorAll('.more-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.card-actions')) {
        document.querySelectorAll('.more-menu').forEach(menu => menu.style.display = 'none');
        }
    });
});

// footer
fetch('footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
});


document.addEventListener('DOMContentLoaded', () => {
  const watchlistContent = document.querySelector('#watchlist-content .watchlist-history');
  const watchlistEmpty = document.getElementById('watchlist-empty');

  function updateEmptyStates() {
    const historyContainer = document.querySelector('.animehistory');
    const historyEmpty = document.getElementById('history-empty');
    const watchlistContainer = document.getElementById('watchlist-content');

    // Check History empty state
    if (!historyContainer.querySelector('.history-card')) {
      historyEmpty.style.display = 'block';
    } else {
      historyEmpty.style.display = 'none';
    }

    // Check Watchlist empty state
    if (!watchlistContent.querySelector('.watchlist-card')) {
      watchlistEmpty.style.display = 'block';
    } else {
      watchlistEmpty.style.display = 'none';
    }
  }

  function renderWatchlist() {
    const playlist = JSON.parse(localStorage.getItem('playlist') || '[]');

    // Clear current watchlist content
    watchlistContent.innerHTML = '';

    playlist.forEach(anime => {
      // Create watchlist card container
      const card = document.createElement('div');
      card.className = 'watchlist-card';

      // Inner wrapper div with position relative
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';

      // Link to anime detail page
      const detailLink = document.createElement('a');
      detailLink.href = `animeDetail.html?title=${encodeURIComponent(anime.title)}`;

      // Image element
      const img = document.createElement('img');
      img.src = anime.image;
      img.alt = anime.title;
      img.className = 'anime-img';

      detailLink.appendChild(img);
      wrapper.appendChild(detailLink);

      // Actions container
      const actions = document.createElement('div');
      actions.className = 'anime-actions';

      // Play button
      const playBtn = document.createElement('button');
      playBtn.className = 'icon-button';
      playBtn.title = 'Play Now';
      playBtn.innerHTML = `<img src="icons/Play.png" alt="Play" class="icon-img">`;
      playBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = `watchAnime.html?title=${encodeURIComponent(anime.title)}`;
      };

      // Detail button
      const detailBtn = document.createElement('button');
      detailBtn.className = 'icon-button';
      detailBtn.title = 'View Anime Details';
      detailBtn.innerHTML = `<img src="icons/more-detail.png" alt="Detail" class="icon-img">`;
      detailBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = `animeDetail.html?title=${encodeURIComponent(anime.title)}#details`;
      };

      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'icon-button remove';
      removeBtn.title = 'Remove from Playlist';
      removeBtn.innerHTML = `<img src="icons/Trash.png" alt="Remove" class="icon-img">`;
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Remove anime from localStorage playlist
        let playlist = JSON.parse(localStorage.getItem('playlist') || '[]');
        playlist = playlist.filter(item => item.title !== anime.title);
        localStorage.setItem('playlist', JSON.stringify(playlist));

        // Go to Watchlist page
        window.location.href = 'watchlist.html';

        // Optional message
        Message(`❌ Removed "${anime.title}" from your playlist.`);

        // Re-render watchlist to update UI immediately
        renderWatchlist();
      };

      actions.appendChild(playBtn);
      actions.appendChild(detailBtn);
      actions.appendChild(removeBtn);

      wrapper.appendChild(actions);

      // Anime title
      const titleDiv = document.createElement('div');
      titleDiv.className = 'anime-title';
      titleDiv.textContent = anime.title;

      card.appendChild(wrapper);
      card.appendChild(titleDiv);

      watchlistContent.appendChild(card);
    });

    // Update empty state visibility
    updateEmptyStates();
  }

  // Initial render
  renderWatchlist();

  // Tab switch handlers (optional)
  const watchlistTab = document.getElementById('watchlist-tab');
  const historyTab = document.getElementById('history-tab');
  const watchlistTabContent = document.getElementById('watchlist-content');
  const historyTabContent = document.getElementById('history-content');

  watchlistTab.onclick = () => {
    watchlistTab.classList.add('active');
    historyTab.classList.remove('active');
    watchlistTabContent.style.display = 'block';
    historyTabContent.style.display = 'none';
  };

  historyTab.onclick = () => {
    historyTab.classList.add('active');
    watchlistTab.classList.remove('active');
    historyTabContent.style.display = 'block';
    watchlistTabContent.style.display = 'none';
  };
});

