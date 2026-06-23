let sealAudioCtx = null;

function getSealAudioCtx() {
  if (!sealAudioCtx) {
    sealAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return sealAudioCtx;
}

function playSealSound() {
  const ac = getSealAudioCtx();
  if (ac.state === 'suspended') ac.resume();

  // two sine tones — a root and a fifth above it
  // together they make an open, resonant interval that feels ritual
  const frequencies = [174.61, 261.63];

  frequencies.forEach(function(freq) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ac.currentTime);

    // sharp attack, long exponential decay — like a singing bowl being struck
    gain.gain.setValueAtTime(0.001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ac.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 2.8);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 3);
  });
}