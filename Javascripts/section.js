
// main Structure section connect to watch anime page

// <!-- This is the container you pass as containerID -->
// <div id="containerID">
//   <section class="section">
//     <h2 class="section-title">Section Name</h2>
//     <div class="slider-wrapper">
//       <button class="scroll-btn left">&#10094;</button>
//       <div class="anime-scroll-container" id="scroll-container-0">
//         <a href="watchAnime.html?title=Encoded%20Title" class="anime-card">
//           <div style="position: relative;">
//             <img src="anime-image.jpg" alt="Anime Title" class="anime-img">
//             <div class="anime-episode">Episode X</div> <!-- Only if episode exists -->
//           </div>
//           <div class="anime-name">Anime Title</div>
//         </a>
//         <!-- More anime cards... -->
//       </div>
//       <button class="scroll-btn right">&#10095;</button>
//     </div>
//   </section>
//   <!-- More sections... -->
// </div>

function addSection(filename, containerID) {
  fetch(filename)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById(containerID);
      if (!container) return;

      Object.entries(data).forEach(([sectionName, animeList], index) => {
        const section = document.createElement('section');
        section.className = 'section';

        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = sectionName;

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';

        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'anime-scroll-container';
        scrollContainer.id = `scroll-container-${index}`;

        animeList.forEach(anime => {
          const link = document.createElement('a');
          link.href = `watchAnime.html?title=${encodeURIComponent(anime.title)}`;
          link.className = 'anime-card';

          const wrapper = document.createElement('div');
          wrapper.style.position = 'relative';

          const img = document.createElement('img');
          img.src = anime.image;
          img.alt = anime.title;
          img.className = 'anime-img';
          wrapper.appendChild(img);

          if (anime.episode) {
            const ep = document.createElement('div');
            ep.className = 'anime-episode';
            ep.textContent = anime.episode;
            wrapper.appendChild(ep);
          }

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

          // ======= Add to playlist button ============
          const addBtn = document.createElement('button');
          addBtn.className = 'icon-button';
          addBtn.title = 'Add to Playlist';
          addBtn.innerHTML = '<img src="icons/add-to-watchlist.png" alt="Add" class="icon-img">';
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

          // Set initial state if already in playlist
          if (localStorage.getItem('isLoggedIn')) {
            const playlist = JSON.parse(localStorage.getItem('playlist') || '[]');
            if (playlist.some(item => item.title === anime.title)) {
              addBtn.classList.add('added-to-playlist');
            }
          }

          if (localStorage.getItem('isLoggedIn')) {
            const playlist = JSON.parse(localStorage.getItem('playlist') || '[]');
            if (playlist.some(item => item.title === anime.title)) {
              addBtn.classList.add('added-to-playlist');
              addBtn.style.backgroundColor = '#8806CE';
            }
          }

          actions.appendChild(playBtn);
          actions.appendChild(detailBtn);
          actions.appendChild(addBtn);
          wrapper.appendChild(actions);

          const name = document.createElement('div');
          name.className = 'anime-name';
          name.textContent = anime.title;

          link.appendChild(wrapper);
          link.appendChild(name);
          scrollContainer.appendChild(link);
        });

        const leftBtn = document.createElement('button');
        leftBtn.className = 'scroll-btn left';
        leftBtn.innerHTML = '&#10094;';
        leftBtn.onclick = () => {
          scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
        };

        const rightBtn = document.createElement('button');
        rightBtn.className = 'scroll-btn right';
        rightBtn.innerHTML = '&#10095;';
        rightBtn.onclick = () => {
          scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
        };

        sliderWrapper.appendChild(leftBtn);
        sliderWrapper.appendChild(scrollContainer);
        sliderWrapper.appendChild(rightBtn);

        section.appendChild(title);
        section.appendChild(sliderWrapper);
        container.appendChild(section);
      });
    });
}




function Message(Mss) {
  const message = document.createElement('div');
  message.textContent = Mss;
  message.style.position = 'fixed';
  message.style.top = '20px';
  message.style.left = '50%';
  message.style.transform = 'translateX(-50%)';
  message.style.background = '#8806CE';
  message.style.color = '#fff';
  message.style.padding = '10px 20px';
  message.style.borderRadius = '8px';
  message.style.zIndex = '9999';
  message.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 1500);
}

function showLogMessage() {
  document.getElementById('logBackdrop').style.display = 'flex';
  document.body.classList.add('modal-open');
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.log-message .close-btn');
  if (closeBtn) {
    closeBtn.onclick = () => {
      document.getElementById('logBackdrop').style.display = 'none';
      document.body.classList.remove('modal-open');
    };
  }

  // Close modal if user clicks outside the log-message box
  const backdrop = document.getElementById('logBackdrop');
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  });
});





function updateScrollButtons(scrollContainer, leftBtn, rightBtn) {
    // Show left button only if not at the start
    leftBtn.style.display = scrollContainer.scrollLeft > 0 ? 'flex' : 'none';
    // Show right button only if not at the end
    rightBtn.style.display =
    scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth - 1
        ? 'flex'
        : 'none';
}

// Run after all sliders are created
function setupAllScrollButtons() {
    document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
    const scrollContainer = wrapper.querySelector('.anime-scroll-container');
    const leftBtn = wrapper.querySelector('.scroll-btn.left');
    const rightBtn = wrapper.querySelector('.scroll-btn.right');
    if (!scrollContainer || !leftBtn || !rightBtn) return;

    // Initial update
    updateScrollButtons(scrollContainer, leftBtn, rightBtn);

    // Update on scroll
    scrollContainer.addEventListener('scroll', () => {
        updateScrollButtons(scrollContainer, leftBtn, rightBtn);
    });

    // Update on resize
    window.addEventListener('resize', () => {
        updateScrollButtons(scrollContainer, leftBtn, rightBtn);
    });
    });
}

// Wait for all sliders to be loaded
window.addEventListener('load', () => {
    setTimeout(setupAllScrollButtons, 300); // Delay to ensure sliders are rendered
});






// Main structure section connect to Anime Detail page

{/* <div id="containerID">
  <section class="section">
    <h2 class="section-title">Section Name</h2>
    <div class="slider-wrapper">
      <button class="scroll-btn left">&#10094;</button>
      <div class="anime-scroll-container" id="scroll-container-0">
        <a href="animeDetail?title=Encoded%20Title" class="anime-card">
          <div style="position: relative;">
            <img src="anime-image.jpg" alt="Anime Title" class="anime-img">
          </div>
          <div class="anime-name">Anime Title</div>
        </a>
        <!-- More anime cards... -->
      </div>
      <button class="scroll-btn right">&#10095;</button>
    </div>
  </section>
  <!-- More sections... -->
</div> */}


function addAnimeSection(filename, containerID) {
  fetch(filename)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById(containerID);
      if (!container) return;

      Object.entries(data).forEach(([sectionName, animeList], index) => {
        const section = document.createElement('section');
        section.className = 'section';

        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = sectionName;

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';

        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'anime-scroll-container';
        scrollContainer.id = `scroll-container-${index}`;

        animeList.forEach(anime => {
          const link = document.createElement('a');
          link.href = `animeDetail.html?title=${encodeURIComponent(anime.title)}`;
          link.className = 'anime-card';

          const wrapper = document.createElement('div');
          wrapper.style.position = 'relative';

          const img = document.createElement('img');
          img.src = anime.image;
          img.alt = anime.title;
          img.className = 'anime-img';
          wrapper.appendChild(img);

          if (anime.episode) {
            const ep = document.createElement('div');
            ep.className = 'anime-episode';
            ep.textContent = anime.episode;
            wrapper.appendChild(ep);
          }

          const actions = document.createElement('div');
          actions.className = 'anime-actions';

          const playBtn = document.createElement('button');
          playBtn.className = 'icon-button';
          playBtn.title = 'Play';
          playBtn.innerHTML = '<img src="icons/Play.png" alt="Play" class="icon-img">';
          playBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = `watchAnime.html?title=${encodeURIComponent(anime.title)}`;
          };

          const detailBtn = document.createElement('button');
          detailBtn.className = 'icon-button';
          detailBtn.title = 'Details';
          detailBtn.innerHTML = '<img src="icons/more-detail.png" alt="Detail" class="icon-img">';
          detailBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = `animeDetail.html?title=${encodeURIComponent(anime.title)}#details`;
          };

          // Add to playlist button
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
              Message(`✅ Removed "${anime.title}" from your playlist.`)
            }
          };

          // Set initial state if already in playlist
          if (localStorage.getItem('isLoggedIn')) {
            const playlist = JSON.parse(localStorage.getItem('playlist') || '[]');
            if (playlist.some(item => item.title === anime.title)) {
              addBtn.classList.add('added-to-playlist');
            }
          }

          if (localStorage.getItem('isLoggedIn')) {
            const playlist = JSON.parse(localStorage.getItem('playlist') || '[]');
            if (playlist.some(item => item.title === anime.title)) {
              addBtn.classList.add('added-to-playlist');
              addBtn.style.backgroundColor = '#8806CE';
            }
          }

          actions.appendChild(playBtn);
          actions.appendChild(detailBtn);
          actions.appendChild(addBtn);
          wrapper.appendChild(actions);

          const name = document.createElement('div');
          name.className = 'anime-name';
          name.textContent = anime.title;

          link.appendChild(wrapper);
          link.appendChild(name);
          scrollContainer.appendChild(link);
        });

        const leftBtn = document.createElement('button');
        leftBtn.className = 'scroll-btn left';
        leftBtn.innerHTML = '&#10094;';
        leftBtn.onclick = () => {
          scrollContainer.scrollBy({ left: -1000, behavior: 'smooth' });
        };

        const rightBtn = document.createElement('button');
        rightBtn.className = 'scroll-btn right';
        rightBtn.innerHTML = '&#10095;';
        rightBtn.onclick = () => {
          scrollContainer.scrollBy({ left: 1000, behavior: 'smooth' });
        };

        sliderWrapper.appendChild(leftBtn);
        sliderWrapper.appendChild(scrollContainer);
        sliderWrapper.appendChild(rightBtn);

        section.appendChild(title);
        section.appendChild(sliderWrapper);
        container.appendChild(section);
      });
    })
    .catch(error => {
      console.error(`Error loading ${filename}:`, error);
    });
}




















function addCharacterSection(filename, containerID) {
  fetch(filename)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById(containerID);
      if (!container) return;

      Object.entries(data).forEach(([sectionName, characterList], index) => {
        const section = document.createElement('section');
        section.className = 'section';

        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = sectionName;

        // Use distinct class here for the slider wrapper
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'char-slider-wrapper';

        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'character-scroll-container';
        scrollContainer.id = `char-scroll-container-${index}`;

        characterList.forEach(char => {
          const card = document.createElement('div');
          card.className = 'character-card';

          const wrapper = document.createElement('div');
          wrapper.style.position = 'relative';

          const img = document.createElement('img');
          img.src = char.image; 
          img.alt = char.name;
          img.className = 'character-img';
          wrapper.appendChild(img);

          const name = document.createElement('div');
          name.className = 'character-name';
          name.textContent = char.name;

          const descOverlay = document.createElement('div');
          descOverlay.className = 'character-description';
          descOverlay.textContent = char.description || 'No description available';

          card.appendChild(wrapper);
          card.appendChild(name);
          card.appendChild(descOverlay);
          scrollContainer.appendChild(card);
        });

        // Left scroll button with unique class
        const leftBtn = document.createElement('button');
        leftBtn.className = 'char-scroll-btn left';
        leftBtn.innerHTML = '&#10094;';
        leftBtn.onclick = () => {
          scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
        };

        // Right scroll button with unique class
        const rightBtn = document.createElement('button');
        rightBtn.className = 'char-scroll-btn right';
        rightBtn.innerHTML = '&#10095;';
        rightBtn.onclick = () => {
          scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
        };

        sliderWrapper.appendChild(leftBtn);
        sliderWrapper.appendChild(scrollContainer);
        sliderWrapper.appendChild(rightBtn);

        section.appendChild(title);
        section.appendChild(sliderWrapper);
        container.appendChild(section);
      });
    })
    .catch(error => {
      console.error(`Error loading character file: ${filename}`, error);
    });
}
