const editor = document.getElementById('editor');
const statusText = document.getElementById('status');
const docListUI = document.getElementById('doc-list');
const newDocBtn = document.getElementById('new-doc-btn');
const titleUI = document.getElementById('current-doc-title');

let documents = JSON.parse(localStorage.getItem('meineDocs')) || {};
let activeDocId = localStorage.getItem('activeDocId') || null;
let timeout;

// Hilfsfunktion: Speichern in den Browser
function saveToStorage() {
    localStorage.setItem('meineDocs', JSON.stringify(documents));
    localStorage.setItem('activeDocId', activeDocId);
}

// Dokumentenliste in der Sidebar neu zeichnen
function renderDocList() {
    docListUI.innerHTML = '';
    for (const id in documents) {
        const li = document.createElement('li');
        li.textContent = documents[id].title;
        if (id === activeDocId) li.classList.add('active');
        li.onclick = () => switchDocument(id);
        docListUI.appendChild(li);
    }
}

// Zwischen Dokumenten wechseln
function switchDocument(id) {
    activeDocId = id;
    editor.value = documents[id].content;
    titleUI.textContent = documents[id].title;
    editor.disabled = false;
    renderDocList();
    saveToStorage();
}

// Neues Dokument erstellen
newDocBtn.addEventListener('click', () => {
    const title = prompt("Name des Dokuments:");
    if (!title) return;
    const id = 'doc_' + Date.now();
    documents[id] = { title: title, content: "" };
    switchDocument(id);
});

// Automatisches Speichern beim Tippen
editor.addEventListener('input', () => {
    if (!activeDocId) return;
    statusText.textContent = 'Speichert...';
    statusText.style.color = '#888';
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        documents[activeDocId].content = editor.value;
        saveToStorage();
        statusText.textContent = 'Gespeichert';
        statusText.style.color = '#28a745';
    }, 800);
});

// Beim Laden initialisieren
if (Object.keys(documents).length > 0) {
    if (!activeDocId || !documents[activeDocId]) activeDocId = Object.keys(documents)[0];
    switchDocument(activeDocId);
} else {
    editor.disabled = true;
}
renderDocList();
