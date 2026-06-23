function getMoonPhase(date) {
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const synodicMonth = 29.530588853;
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSince = (date.getTime() - knownNewMoon.getTime()) / msPerDay;

  let age = daysSince % synodicMonth;
  if (age < 0) age += synodicMonth;

  // the four "cardinal" phases happen at a specific moment, not a range —
  // so we only give them a narrow ~1 day window around that exact point
  const cardinalWindow = 1;
  const quarter = synodicMonth / 4;        // ~7.38 days — First Quarter
  const half = synodicMonth / 2;           // ~14.77 days — Full Moon
  const threeQuarter = synodicMonth * 3 / 4; // ~22.15 days — Last Quarter

  if (age < cardinalWindow || age > synodicMonth - cardinalWindow) {
    return { name: 'New Moon', emoji: '🌑' };
  }
  if (Math.abs(age - quarter) < cardinalWindow) {
    return { name: 'First Quarter', emoji: '🌓' };
  }
  if (Math.abs(age - half) < cardinalWindow) {
    return { name: 'Full Moon', emoji: '🌕' };
  }
  if (Math.abs(age - threeQuarter) < cardinalWindow) {
    return { name: 'Last Quarter', emoji: '🌗' };
  }

  if (age < quarter) return { name: 'Waxing Crescent', emoji: '🌒' };
  if (age < half) return { name: 'Waxing Gibbous', emoji: '🌔' };
  if (age < threeQuarter) return { name: 'Waning Gibbous', emoji: '🌖' };
  return { name: 'Waning Crescent', emoji: '🌘' };
}