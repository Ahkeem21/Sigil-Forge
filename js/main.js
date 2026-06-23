// grab the elements we need from the HTML
const errorMessage = document.getElementById('error-message');
const intentionInput = document.getElementById('intention-input');
const generateBtn = document.getElementById('generate-btn');
const sigilCanvas = document.getElementById('sigil-canvas');
const sealBtn = document.getElementById('seal-btn');
const moonDisplay = document.getElementById('moon-display');
const currentMoon = getMoonPhase(new Date());
moonDisplay.textContent = `${currentMoon.emoji} ${currentMoon.name}`;

// keep track of the current sigil state
let currentWord = '';
let currentReduced = '';

// listen for the generate button click
generateBtn.addEventListener('click', function() {
  const word = intentionInput.value.trim();
  if (!word) return;

  const reduced = reduceToStrokes(word);

  if (reduced.length === 0) {
    errorMessage.textContent = 'That intention has no consonants to forge with.';
    errorMessage.classList.remove('hidden');
    sigilCanvas.innerHTML = '';
    sealBtn.classList.add('hidden');
    return;
  }

  errorMessage.classList.add('hidden');
  currentWord = word;
  currentReduced = generateSigil(word, sigilCanvas);
  sealBtn.classList.remove('hidden');
});

// listen for the seal button click
sealBtn.addEventListener('click', function() {
  if (!currentWord) return;
  playSealSound(); // Play the sound of sealing the sigil
  saveToGrimoire(currentWord, sigilCanvas);

  // reset the state
  intentionInput.value = '';
  sigilCanvas.innerHTML = '';
  sealBtn.classList.add('hidden');
  currentWord = '';
  currentReduced = '';
});