document.addEventListener("DOMContentLoaded", () => {
  makeDelayChart();
  makePostureChart();
});


(function(){
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const statusEl = document.getElementById('formStatus');
  const form = document.getElementById('contactForm');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();


  if (themeBtn){
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'light') html.setAttribute('data-theme','light');
    themeBtn.addEventListener('click', ()=>{
      const isLight = html.getAttribute('data-theme') === 'light';
      html.setAttribute('data-theme', isLight ? 'dark' : 'light');
      localStorage.setItem('theme', isLight ? 'dark' : 'light');
      themeBtn.setAttribute('aria-pressed', String(!isLight));
    });
  }
  })();


// ==================== make delay chart ====================
function makeDelayChart() {
  const data = [
    { reason: "phone", value: 50 },
    { reason: "stardew valley", value: 20 },
    { reason: "drama show", value: 15 },
    { reason: "sleep", value: 10 },
    { reason: "tidy up room", value: 5 }
  ];

  const width = 500, height = 300;
  const svg = createSVG(width, height);

  const barHeight = 30;
  const gap = 15;
  const maxValue = Math.max(...data.map(d => d.value));

  data.forEach((d, i) => {
    const barWidth = (d.value / maxValue) * (width - 150); 
    const x = 120; 
    const y = i * (barHeight + gap) + 30;

   //bar
    const rect = make("rect", {
      x, y,
      width: barWidth,
      height: barHeight,
      fill: "#0ea5e9"
    });
    svg.appendChild(rect);

    //text label
    const label = make("text", {
      x: 10,
      y: y + barHeight / 2 + 5,
      "font-size": "14",
      fill: "currentColor"

    });
    label.textContent = d.reason;
    svg.appendChild(label);

    // number
    const value = make("text", {
      x: x + barWidth + 5,
      y: y + barHeight / 2 + 5,
      "font-size": "12",
      fill: "currentColor"

    });
    value.textContent = d.value + "%";
    svg.appendChild(value);
  });

  document.getElementById("delayChart").appendChild(svg);
}

// ==================== second graph====================
function makePostureChart() {
  const data = [
    { posture: "lay", value: 5 },
    { posture: "sit", value: 15 },
    { posture: "bed", value: 5 },
    { posture: "library", value: 80 }
  ];

  const width = 400, height = 300;
  const svg = createSVG(width, height);

  const barWidth = 60;
  const gap = 30;
  const maxValue = Math.max(...data.map(d => d.value));

  data.forEach((d, i) => {
    const barHeight = (d.value / maxValue) * (height - 50);
    const x = i * (barWidth + gap) + 50;
    const y = height - barHeight - 30;

    // bar
    const rect = make("rect", {
      x, y,
      width: barWidth,
      height: barHeight,
      fill: "#ff69b4"
    });
    svg.appendChild(rect);

   //text label
    const label = make("text", {
      x: x + barWidth / 2,
      y: height - 10,
      "text-anchor": "middle",
      "font-size": "12",
      fill: "currentColor"

    });
    label.textContent = d.posture;
    svg.appendChild(label);

    // number
    const value = make("text", {
      x: x + barWidth / 2,
      y: y - 5,
      "text-anchor": "middle",
      "font-size": "12",
      fill: "currentColor"

    });
    value.textContent = d.value + "%";
    svg.appendChild(value);
  });

  document.getElementById("postureChart").appendChild(svg);
}

// ==================== counting ====================
function createSVG(width, height) {
  return make("svg", { width, height });
}

function make(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  return el;
}
