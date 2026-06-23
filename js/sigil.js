function reduceToStrokes(word) {
  // Step 1: lowercase and remove spaces
  let letters = word.toLowerCase().replace(/\s+/g, '');

  // Step 2: remove vowels
  letters = letters.replace(/[aeiou]/g, '');

  // Step 3: remove duplicate letters, keep first occurrence
  const seen = new Set();
  let unique = '';
  for (const char of letters) {
    if (!seen.has(char)) {
      seen.add(char);
      unique += char;
    }
  }

  return unique;
}

function lettersToPoints(letters, centerX, centerY, radius) {
  const points = [];

  for (const char of letters) {
    // find this letter's position in the alphabet (a=0, b=1, ... z=25)
    const index = char.charCodeAt(0) - 'a'.charCodeAt(0);

    // divide the circle into 26 equal slices
    const angle = (index / 26) * (Math.PI * 2);

    // convert the angle to x,y coordinates
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    points.push({ x, y });
  }

  return points;
}

function drawSigil(svgElement, points) {
  svgElement.innerHTML = '';
  

  // draw the faint circle guide
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', 200);
  circle.setAttribute('cy', 200);
  circle.setAttribute('r', 150);
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', '#1e1a2e');
  circle.setAttribute('stroke-width', '1');
  svgElement.appendChild(circle);

  // build a path data string from the points
  let pathData = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }

  // create the path element
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#9b8fc4');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('filter', 'url(#glow)');
  svgElement.appendChild(path);

  // get the total length of the path
  const length = path.getTotalLength();

  // make the line invisible by offsetting the dash by its full length
  path.setAttribute('stroke-dasharray', length);
  path.setAttribute('stroke-dashoffset', length);

 // force the browser to apply the "invisible" state right now,
// before we add the transition and change the value
path.getBoundingClientRect();

// now set up the transition and animate to fully visible
path.style.transition = 'stroke-dashoffset 1.8s ease-in-out';
path.setAttribute('stroke-dashoffset', 0);

  // start dot
  const startDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  startDot.setAttribute('cx', points[0].x);
  startDot.setAttribute('cy', points[0].y);
  startDot.setAttribute('r', 5);
  startDot.setAttribute('fill', '#6b5fa0');
  startDot.setAttribute('filter', 'url(#glow)');
  svgElement.appendChild(startDot);

  // end dot
  const endDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  endDot.setAttribute('cx', points[points.length - 1].x);
  endDot.setAttribute('cy', points[points.length - 1].y);
  endDot.setAttribute('r', 5);
  endDot.setAttribute('fill', '#c9c3d4');
  endDot.setAttribute('filter', 'url(#glow)');
  svgElement.appendChild(endDot);
}

function generateSigil(word, svgElement) {
  const reduced = reduceToStrokes(word);
  const points = lettersToPoints(reduced, 200, 200, 150);
  drawSigil(svgElement, points);
  return reduced;
}