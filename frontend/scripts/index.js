// frontend/scripts/index.js
document.addEventListener('load', function () {
    fetchEmails();
});

async function fetchEmails() {
    try {
        const response = await fetch("http://localhost:8888/api/emails");
        const emails = await response.json();
        displayEmails(emails);
    } catch (error) {
        console.error('Errore nel recupero delle email:', error);
    }
}

function displayEmails(emails) {
    const emailsContainer = document.getElementById('emails-container');
    emailsContainer.innerHTML = "";  // Clear the container

    emails.forEach(email => {
        const emailDiv = document.createElement('div');
        emailDiv.classList.add('email-item');
        emailDiv.innerHTML = `
            <h3>${email.subject}</h3>
            <p><strong>From:</strong> ${email.from}</p>
            <p><strong>Date:</strong> ${email.date}</p>
            <p>${email.body}</p>
            <hr>
        `;
        emailsContainer.appendChild(emailDiv);
    });
}
