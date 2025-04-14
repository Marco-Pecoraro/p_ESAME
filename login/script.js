const scrollDown = document.getElementById('scrollDown');
const loginForm = document.getElementById('loginForm');
let hasScrolled = false;

// Funzione per mostrare il form
function showForm() {
    if (hasScrolled) return;
    hasScrolled = true;

    scrollDown.classList.add('hide-scroll');
    setTimeout(() => {
        loginForm.classList.add('active');
        document.body.classList.add('no-scroll');
    }, 300);
}

// Click su "Scroll Down"
scrollDown.addEventListener('click', () => {
    showForm();
});

// Scroll per attivare il form
let lastScrollY = 0;
function handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50 && !hasScrolled) {
        showForm();
    }
    lastScrollY = scrollY;
    requestAnimationFrame(handleScroll);
}
requestAnimationFrame(handleScroll);

// Gestione animazione ripple sul pulsante
document.querySelector('.google-btn').addEventListener('click', function (e) {
    // Rimuovi eventuali ripple precedenti
    const existingRipples = this.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    this.appendChild(ripple);

    // Simula caricamento
    this.classList.add('loading');
    this.querySelector('span').textContent = 'Loading...';
    setTimeout(() => {
        this.querySelector('span').textContent = 'Accedi con Google';
        this.classList.remove('loading');
    }, 2000);
});