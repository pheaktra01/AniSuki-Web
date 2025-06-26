// none login message scripts
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

function showLogMessage() {
    document.getElementById('logBackdrop').style.display = 'flex';
    document.body.classList.add('modal-open');
}

// footer scripts
fetch('footer.html')
.then(response => response.text())
.then(html => {
    document.getElementById('footer').innerHTML = html;
});