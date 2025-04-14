//#region variabili
const navItems = document.querySelectorAll('.email-nav li');
const emailList = document.querySelector('#emailList');
const calendarSection = document.querySelector('#calendarSection');
const emailItems = document.querySelectorAll('.email-item');
const composeModal = document.querySelector('#composeModal');
const settingsModal = document.querySelector('#settingsModal');
const eventModal = document.querySelector('#eventModal');
const emailPreviewModal = document.querySelector('#emailPreviewModal');
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
const searchInput = document.querySelector('#searchInput');
const addEventBtn = document.querySelector('.add-event-btn');
const eventTitleInput = document.querySelector('#eventTitle');
const eventDateInput = document.querySelector('#eventDate');
const eventTimeInput = document.querySelector('#eventTime');
const logoutBtn = document.querySelector('.logout-btn');
const saveAccountBtn = document.querySelector('.save-account-btn');
const previewSender = document.querySelector('#previewSender');
const previewSubject = document.querySelector('#previewSubject');
const previewBody = document.querySelector('#previewBody');
const previewTime = document.querySelector('#previewTime');
const deleteBtn = document.querySelector('.delete-btn');
const replyBtn = document.querySelector('.reply-btn');
const aiReplyBtn = document.querySelector('.ai-reply-btn');
const notificationsCheckbox = document.querySelector('#notifications');
const darkThemeCheckbox = document.querySelector('#darkTheme');
const showEmailCountCheckbox = document.querySelector('#showEmailCount');
const emailCounts = document.querySelectorAll('.email-count');
const composeInput = document.querySelector('.compose-input');
const composeSubject = document.querySelector('.compose-subject');
const composeText = document.querySelector('.compose-text');

let currentDate = new Date(2025, 3, 14);
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let currentCategory = 'inbox';
let events = [{ date: new Date(2025, 3, 15), title: "Meeting Tomorrow", time: "10:00 AM" }];
let currentEmail = null;

//#endregion variabili

function updateEmailCounts() {
    const counts = {};
    navItems.forEach(item => {
        const category = item.getAttribute('data-category');
        counts[category] = category === 'calendar' ? 0 : Array.from(emailItems).filter(email =>
            email.getAttribute('data-category').split(' ').includes(category) || (category === 'inbox' && !email.getAttribute('data-category').includes('sent') && !email.getAttribute('data-category').includes('trash'))
        ).length;
        item.querySelector('.email-count').textContent = counts[category];
    });
}

function toggleEmailCountVisibility(show) {
    emailCounts.forEach(count => {
        count.style.display = show ? 'inline-block' : 'none';
    });
}

function filterEmails(category, searchTerm = '') {
    currentCategory = category;
    document.title = `inboxit > ${navItems[Array.from(navItems).findIndex(item => item.classList.contains('active'))].textContent.split(' ')[0]}`;
    emailList.style.display = category === 'calendar' ? 'none' : 'block';
    calendarSection.style.display = category === 'calendar' ? 'block' : 'none';
    searchInput.placeholder = `Cerca in ${navItems[Array.from(navItems).findIndex(item => item.classList.contains('active'))].textContent.split(' ')[0]}`;

    if (category !== 'calendar') {
        emailItems.forEach(item => {
            const itemCategories = item.getAttribute('data-category').split(' ');
            const matchesCategory = category === 'inbox' || itemCategories.includes(category);
            const matchesSearch = !searchTerm ||
                item.getAttribute('data-sender').toLowerCase().includes(searchTerm) ||
                item.getAttribute('data-subject').toLowerCase().includes(searchTerm) ||
                item.getAttribute('data-body').toLowerCase().includes(searchTerm);
            item.style.display = matchesCategory && matchesSearch ? 'flex' : 'none';
        });
    }
}

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

    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-date', 'empty');
        calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('calendar-date');
        dateDiv.textContent = day;

        const currentDay = new Date(year, month, day);
        if (currentDay.getDate() === currentDate.getDate() && currentDay.getMonth() === currentDate.getMonth() && currentDay.getFullYear() === currentDate.getFullYear()) {
            dateDiv.classList.add('today');
        }

        events.forEach(event => {
            if (event.date.getDate() === day && event.date.getMonth() === month && event.date.getFullYear() === year) {
                dateDiv.classList.add('event');
            }
        });

        dateDiv.addEventListener('click', () => {
            toggleModal(eventModal, true);
            eventDateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        });

        calendarGrid.appendChild(dateDiv);
    }

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

generateCalendar(currentMonth, currentYear);

prevBtn.addEventListener('click', () => {
    currentMonth = currentMonth > 0 ? currentMonth - 1 : 11;
    currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
    generateCalendar(currentMonth, currentYear);
});

nextBtn.addEventListener('click', () => {
    currentMonth = currentMonth < 11 ? currentMonth + 1 : 0;
    currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
    generateCalendar(currentMonth, currentYear);
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        filterEmails(item.getAttribute('data-category'), searchInput.value.toLowerCase());
    });
});

function toggleModal(modal, show) {
    modal.classList.toggle('active', show);
    overlay.classList.toggle('active', show);
}

composeBtn.addEventListener('click', () => toggleModal(composeModal, true));
settingsBtn.addEventListener('click', () => toggleModal(settingsModal, true));

closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        toggleModal(composeModal, false);
        toggleModal(settingsModal, false);
        toggleModal(eventModal, false);
        toggleModal(emailPreviewModal, false);
    });
});

saveBtn.addEventListener('click', () => {
    toggleModal(settingsModal, false);
    alert('Impostazioni salvate! (Simulazione)');
});

logoutBtn.addEventListener('click', () => {
    toggleModal(settingsModal, false);
    alert('Logout effettuato! (Simulazione)');
});

saveAccountBtn.addEventListener('click', () => {
    toggleModal(settingsModal, false);
    alert('Modifiche account salvate! (Simulazione)');
});

searchInput.addEventListener('input', () => {
    filterEmails(currentCategory, searchInput.value.toLowerCase());
});

addEventBtn.addEventListener('click', () => {
    const title = eventTitleInput.value;
    const date = new Date(eventDateInput.value);
    const time = eventTimeInput.value;

    if (title && date && time) {
        events.push({ date, title, time });
        generateCalendar(currentMonth, currentYear);
        toggleModal(eventModal, false);
        alert('Evento aggiunto! (Simulazione)');
    } else {
        alert('Compila tutti i campi!');
    }
});

emailItems.forEach(item => {
    item.addEventListener('click', () => {
        currentEmail = item;
        previewSender.textContent = item.getAttribute('data-sender');
        previewSubject.textContent = item.getAttribute('data-subject');
        previewBody.textContent = item.getAttribute('data-body');
        previewTime.textContent = item.getAttribute('data-time');
        toggleModal(emailPreviewModal, true);
    });
});

deleteBtn.addEventListener('click', () => {
    if (currentEmail) {
        let categories = currentEmail.getAttribute('data-category').split(' ');
        if (!categories.includes('trash')) {
            categories = categories.filter(cat => cat !== 'inbox' && cat !== 'important' && cat !== 'meetings' && cat !== 'sent');
            categories.push('trash');
            currentEmail.setAttribute('data-category', categories.join(' '));
            updateEmailCounts();
            filterEmails(currentCategory, searchInput.value.toLowerCase());
            toggleModal(emailPreviewModal, false);
            alert('Email spostata nel cestino! (Simulazione)');
        }
    }
});

replyBtn.addEventListener('click', () => {
    if (currentEmail) {
        composeInput.value = currentEmail.getAttribute('data-sender');
        composeSubject.value = `Re: ${currentEmail.getAttribute('data-subject')}`;
        composeText.value = '';
        toggleModal(emailPreviewModal, false);
        toggleModal(composeModal, true);
    }
});

aiReplyBtn.addEventListener('click', () => {
    if (currentEmail) {
        composeInput.value = currentEmail.getAttribute('data-sender');
        composeSubject.value = `Re: ${currentEmail.getAttribute('data-subject')}`;
        composeText.value = `Ciao ${currentEmail.getAttribute('data-sender')},\n\nGrazie per il tuo messaggio. Confermo la mia disponibilità per l'appuntamento di domani alle 10:00. Ci vediamo!\n\nCordiali saluti,\n[Il tuo nome]`;
        toggleModal(emailPreviewModal, false);
        toggleModal(composeModal, true);
    }
});

darkThemeCheckbox.addEventListener('change', () => {
    document.body.classList.toggle('dark', darkThemeCheckbox.checked);
});

showEmailCountCheckbox.addEventListener('change', () => {
    toggleEmailCountVisibility(showEmailCountCheckbox.checked);
});

updateEmailCounts();
toggleEmailCountVisibility(showEmailCountCheckbox.checked);
filterEmails('inbox');