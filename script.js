const editor = document.getElementById('editor');
const statusText = document.getElementById('status');

// 1. Gespeicherten Text aus dem Browser-Speicher laden
const savedText = localStorage.getItem('meinDokumentText');
if (savedText) {
    editor.value = savedText;
}

let timeout;

// 2. Event-Listener: Erkennt, wenn du tippst
editor.addEventListener('input', () => {
    statusText.textContent = 'Speichert...';
    statusText.style.color = '#888';

    // Kurze Pause abwarten, bevor gespeichert wird (schont Ressourcen)
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        // Text lokal im Browser speichern
        localStorage.setItem('meinDokumentText', editor.value);
        statusText.textContent = 'Gespeichert';
        statusText.style.color = '#28a745';
    }, 1000); // Speichert 1 Sekunde nach deinem letzten Tastenanschlag
});
