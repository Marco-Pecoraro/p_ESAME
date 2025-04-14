document.addEventListener('DOMContentLoaded', function () {
    fetchEmails();

    document.getElementById("sync-button").addEventListener("click", async () => {
        try {
            const response = await fetch("http://localhost:8888/api/emails/sync", {
                method: "POST",
            });
            const result = await response.json();
            alert(`Sincronizzate ${result.count} email`);
            fetchEmails(); // Ricarica
        } catch (err) {
            console.error("Errore durante la sincronizzazione:", err);
        }
    });
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
    emailsContainer.innerHTML = "";  // Clear

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
