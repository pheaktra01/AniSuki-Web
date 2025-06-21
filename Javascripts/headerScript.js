fetch('header.html')
    .then(response => response.text())
    .then(data => {
    document.getElementById('navbar').innerHTML = data;

    // Now navbar is in DOM — set up event listeners:
    setupNavbar();
    });

function setupNavbar() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileMenu = document.getElementById('profileMenu');
    const profileContainer = document.getElementById('profileContainer');
    const loginLink = document.getElementById('loginLink');

    hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    profileMenu.classList.remove('active');
    });

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
    loginLink.style.display = 'none';
    profileContainer.style.display = 'flex';
    } else {
    loginLink.style.display = 'inline-block';
    profileContainer.style.display = 'none';
    }

    profileAvatar?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('active');
    });

    window.addEventListener('click', (e) => {
    if (!profileContainer.contains(e.target)) {
        profileMenu.classList.remove('active');
    }
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
    });

    // Close nav menu on nav link click:
    document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
    });
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'registerForm.html';
}