// Elementi
const scrollDown = document.getElementById('scrollDown');
const loginForm = document.getElementById('loginForm');
const dynamicText = document.getElementById('dynamicText');
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
scrollDown.addEventListener('click', (e) => {
    console.log('Click su Scroll Down');
    showForm();
});

// Scroll per attivare il form
window.addEventListener('scroll', () => {
    console.log('Scroll rilevato, scrollY:', window.scrollY);
    if (window.scrollY > 50) {
        showForm();
    }
});

// Gestione animazione ripple sul pulsante
document.querySelector('.google-btn').addEventListener('click', function(e) {
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
        this.querySelector('span').textContent = 'Sign in with Google';
        this.classList.remove('loading');
    }, 2000);
});

// Cambio testo dinamico
const messages = [
    "One click to enter",
    "Welcome to Inboxit",
    "Simple and fast"
];
let currentMessageIndex = 0;

function changeText() {
    dynamicText.style.animation = 'fadeText 5s ease';
    dynamicText.textContent = messages[currentMessageIndex];
    currentMessageIndex = (currentMessageIndex + 1) % messages.length;
}

dynamicText.addEventListener('animationend', changeText);
setTimeout(changeText, 1000);