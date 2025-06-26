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

    //remove in watchlist
    const removeButtons = document.querySelectorAll('.icon-button.remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.watchlist-card');
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