function saveToGrimoire(word, svgElement) {
  // grab the current SVG markup as a string
  const svgMarkup = svgElement.outerHTML;
  const moon = getMoonPhase(new Date());

  // build the entry object
  const entry = {
    word: word,
    svg: svgMarkup,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    moonPhase: moon.name,
    moonEmoji: moon.emoji
  };

  // load whatever is already saved, add the new entry, save it back
  const existing = loadGrimoire();
  existing.unshift(entry); // add to the front, not the back
  localStorage.setItem('grimoire', JSON.stringify(existing));

  // re-render the grimoire list on screen
  renderGrimoire();
}

function loadGrimoire() {
  const raw = localStorage.getItem('grimoire');
  return raw ? JSON.parse(raw) : [];
}

function renderGrimoire() {
  const list = document.getElementById('grimoire-list');
  const entries = loadGrimoire();

  list.innerHTML = '';

  if (entries.length === 0) {
    list.innerHTML = '<p style="color:#4a4060; font-size:0.85rem; letter-spacing:0.05em;">No sigils sealed yet.</p>';
    return;
  }

  entries.forEach(function(entry, index) {
    const div = document.createElement('div');
    div.className = 'grimoire-entry';
    const moonLine = entry.moonPhase ? ` · ${entry.moonEmoji} ${entry.moonPhase}` : '';

    div.innerHTML = `
      ${entry.svg}
      <div class="grimoire-entry-info">
        <span class="grimoire-entry-word">${entry.word}</span>
        <span class="grimoire-entry-date">${entry.date}${moonLine}</span>
      </div>
      <button class="delete-entry-btn" data-index="${index}">✕</button>
    `;

    list.appendChild(div);
  });

  // attach delete listeners after all entries are in the DOM
  document.querySelectorAll('.delete-entry-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const index = parseInt(btn.dataset.index, 10);
      deleteFromGrimoire(index);
    });
  });
}

function deleteFromGrimoire(index) {
  const entries = loadGrimoire();
  entries.splice(index, 1);
  localStorage.setItem('grimoire', JSON.stringify(entries));
  renderGrimoire();
}

// render on page load so saved sigils appear immediately
renderGrimoire();