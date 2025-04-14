// Elementi
const navItems = document.querySelectorAll('.email-nav li');
const emailList = document.querySelector('#emailList');
const calendarSection = document.querySelector('#calendarSection');
const emailItems = document.querySelectorAll('.email-item');
const composeModal = document.querySelector('#composeModal');
const settingsModal = document.querySelector('#settingsModal');
const composeBtn = document.querySelector('.compose-btn');
const settingsBtn = document.querySelector('.settings-btn');
const overlay = document.querySelector('#overlay');
const closeButtons = document.querySelectorAll('.close-btn');
const saveBtn = document.querySelector('.save-btn');
const calendarGrid = document.querySelector('#calendarGrid');
const calendarMonth = document.querySelector('#calendarMonth');
const prevBtn = document.querySelector('.calendar-nav.prev');
const nextBtn = document.querySelector('.calendar-nav.next');
const eventsList = document.querySelector('#eventsList');

// Stato del calendario
let currentDate = new Date(2025, 3, 14); // 14 Aprile 2025
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Eventi di esempio (estratti dalle email)
const events = [
    { date: new Date(2025, 3, 15), title: "Meeting Tomorrow", time: "10:00 AM" }
];

// Funzione per filtrare le email in base alla categoria
function filterEmails(category) {
    emailList.style.display = category === 'calendar' ? 'none' : 'block';
    calendarSection.style.display = category === 'calendar' ? 'block' : 'none';

    if (category !== 'calendar') {
        emailItems.forEach(item => {
            const itemCategories = item.getAttribute('data-category').split(' ');
            if (category === 'inbox' || itemCategories.includes(category)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Funzione per generare il calendario
function generateCalendar(month, year) {
    calendarGrid.innerHTML = `
        <div class="calendar-day">Dom</div>
        <div class="calendar-day">Lun</div>
        <div class="calendar-day">Mar</div>
        <div class="calendar-day">Mer</div>
        <div class="calendar-day">Gio</div>
        <div class="calendar-day">Ven</div>
        <div class="calendar-day">Sab</div>
    `;
    calendarMonth.textContent = `${new Date(year, month).toLocaleString('it-IT', { month: 'long' })} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Aggiungi spazi vuoti prima del primo giorno
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-date', 'empty');
        calendarGrid.appendChild(emptyDay);
    }

    // Aggiungi i giorni del mese
    for (let day = 1; day <= daysInMonth; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('calendar-date');
        dateDiv.textContent = day;

        const currentDay = new Date(year, month, day);
        if (currentDay.getDate() === currentDate.getDate() &&
            currentDay.getMonth() === currentDate.getMonth() &&
            currentDay.getFullYear() === currentDate.getFullYear()) {
            dateDiv.classList.add('today');
        }

        events.forEach(event => {
            if (event.date.getDate() === day &&
                event.date.getMonth() === month &&
                event.date.getFullYear() === year) {
                dateDiv.classList.add('event');
            }
        });

        calendarGrid.appendChild(dateDiv);
    }

    // Aggiorna la lista degli eventi
    eventsList.innerHTML = '<h3>Eventi</h3>';
    events.forEach(event => {
        if (event.date.getMonth() === month && event.date.getFullYear() === year) {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event-item');
            eventDiv.textContent = `${event.title} - ${event.date.getDate()} ${calendarMonth.textContent.split(' ')[0]}, ${event.time}`;
            eventsList.appendChild(eventDiv);
        }
    });
}

// Inizializza il calendario
generateCalendar(currentMonth, currentYear);

// Navigazione del calendario
prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
});

nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
});

// Aggiungi evento di click alle categorie
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        const category = item.getAttribute('data-category');
        filterEmails(category);
    });
});

// Gestione apertura/chiusura delle modali
function toggleModal(modal, show) {
    if (show) {
        modal.classList.add('active');
        overlay.classList.add('active');
    } else {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }
}

composeBtn.addEventListener('click', () => {
    toggleModal(composeModal, true);
});

settingsBtn.addEventListener('click', () => {
    toggleModal(settingsModal, true);
});

closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        toggleModal(composeModal, false);
        toggleModal(settingsModal, false);
    });
});

saveBtn.addEventListener('click', () => {
    toggleModal(settingsModal, false);
    alert('Impostazioni salvate! (Simulazione)');
});

// Inizializza mostrando le email della categoria "In Arrivo"
filterEmails('inbox');