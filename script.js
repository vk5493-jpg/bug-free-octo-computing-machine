const editor = document.getElementById('editor');
const statusText = document.getElementById('status');
const docListUI = document.getElementById('doc-list');
const newDocBtn = document.getElementById('new-doc-btn');
const titleUI = document.getElementById('current-doc-title');

// Daten aus localStorage laden oder leeres Objekt erstellen
let documents = JSON.parse(localStorage.getItem('meineDocs')) || {};
let activeDocId = localStorage.getItem('activeDocId') || null;
let timeout;

// --- FUNKTIONEN ---

// Speichert den aktuellen Zustand im Browser-Speicher
function saveToStorage() {
    localStorage.setItem('meineDocs', JSON.stringify(documents));
    localStorage.setItem('activeDocId', activeDocId);
}

// Aktualisiert die Liste in der Sidebar
function renderDocList() {
    docListUI.innerHTML = '';
    
    for (const id in documents) {
        const li = document.createElement('li');
        li.textContent = documents[id].title;
        
        // Markiere das aktuell ausgewählte Dokument
        if (id === activeDocId) {
            li.classList.add('active');
        }
        
        li.onclick = () => switchDocument(id);
        docListUI.appendChild(li);
    }
}

// Wechselt das Dokument im Editor
function switchDocument(id) {
    if (!documents[id]) return;
    
    activeDocId = id;
    editor.value = documents[id].content;
    titleUI.textContent = documents[id].title;
    editor.disabled = false;
    
    renderDocList();
    saveToStorage();
}

// Erstellt ein neues Dokument
function createNewDocument() {
    const title = prompt("Name des neuen Dokuments:", "Unbenanntes Dokument");
    if (title === null) return; // Abbrechen, falls User "Abbrechen" klickt

    const id = 'doc_' + Date.now(); // Eindeutige ID basierend auf Zeitstempel
    documents[id] = {
        title: title || "Unbenannt",
        content: ""
    };
    
    switchDocument(id);
}

// --- INITIALISIERUNG BEIM LADEN ---

if (Object.keys(documents).length === 0) {
    // Falls die Liste komplett leer ist, Editor sperren
    editor.disabled = true;
    titleUI.textContent = "Kein Dokument vorhanden";
} else {
    // Falls Dokumente da sind, das letzte aktive oder das erste laden
    if (!activeDocId || !documents[activeDocId]) {
        activeDocId = Object.keys(documents)[0];
    }
    switchDocument(activeDocId);
}

renderDocList();

// --- EVENT LISTENER ---

newDocBtn.addEventListener('click', createNewDocument);

editor.addEventListener('input', () => {
    if (!activeDocId) return;

    statusText.textContent = 'Speichert...';
    statusText.style.color = '#888';

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        // Inhalt im Objekt aktualisieren und speichern
        documents[activeDocId].content = editor.value;
        saveToStorage();
        
        statusText.textContent = 'Gespeichert';
        statusText.style.color = '#28a745';
    }, 800); // Speichert 0,8 Sekunden nach dem letzten Tippen
});
