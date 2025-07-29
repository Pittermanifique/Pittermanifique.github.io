async function envoyerRapport() {
    const fileInput = document.querySelector('input[type="file"]');
    const plaqueInput = document.querySelector('input[placeholder="Plaque (AA-000-AA)"]');
    const commentaireInput = document.querySelector('textarea[placeholder="Commentaire"]');
    const checkboxes = document.querySelectorAll('.note-checkbox');

    // Additionner les valeurs cochées
    let note = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) note += parseInt(cb.value, 10);
    });

    const formData = new FormData();
    if (fileInput && fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    }
    if (plaqueInput && plaqueInput.value) {
        formData.append('plaque', plaqueInput.value);
    }
    formData.append('note', note);
    if (commentaireInput && commentaireInput.value) {
        formData.append('commentaire', commentaireInput.value);
    }

    try {
        const response = await fetch('https://baddrivers.onrender.com/report/', {
            method: 'POST',
            body: formData,
            mode: 'cors' // ✅ assure que le navigateur autorise la requête cross-origin
        });

        const data = await response.json();
        if (data.status === "ok") {
            alert('Rapport envoyé avec succès !');
        } else if (data.status === "none") {
            alert('Erreur : plaque invalide. Veuillez vérifier le format (AA-000-AA).');
        } else {
            alert('Erreur : ' + (data.detail || 'Une erreur est survenue.'));
        }
    } catch (error) {
        console.error("Erreur API :", error);
        alert('Erreur de connexion à l\'API.');
    }
}

async function getClassement(top = 10) {
    try {
        const response = await fetch(`https://baddrivers.onrender.com/clasement/?top=${top}`, {
            method: 'GET',
            mode: 'cors' // ✅ ici aussi
        });
        const data = await response.json();

        const podiumIds = ["podium-1", "podium-2", "podium-3"];
        const entries = Object.entries(data);

        for (let i = 0; i < 3; i++) {
            const podium = document.getElementById(podiumIds[i]);
            if (podium && entries[i]) {
                podium.textContent = `${entries[i][0]}`;
            } else if (podium) {
                podium.textContent = "";
            }
        }

        const container = document.getElementById('classement-container');
        container.innerHTML = "";
        for (let i = 3; i < entries.length; i++) {
            const div = document.createElement('div');
            div.className = "classement-item";
            div.textContent = `${i + 1} : ${entries[i][0]}`;
            container.appendChild(div);
        }
    } catch (error) {
        console.error("Erreur de classement :", error);
        alert("Erreur lors de la récupération du classement.");
    }
}
