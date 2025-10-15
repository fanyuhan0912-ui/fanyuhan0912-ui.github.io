document.addEventListener("DOMContentLoaded", () => {
  makeDelayChart();
  makePostureChart();
});

(function(){
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
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

// ==================== make delay chart  ====================
function makeDelayChart() {

  const data = [
    { reason: "phone", value: 50 },
    { reason: "stardew valley", value: 20 },
    { reason: "drama show", value: 15 },
    { reason: "sleep", value: 10 },
    { reason: "tidy up room", value: 5 }
  ];

  
  const width = 500, height = 300;
  const barHeight = 30;
  const gap = 15;
  const leftLabelSpace = 120;
  const rightPadding = 20;

  
  const svg = createSVG(width, height);

 
  let tooltip = document.getElementById('chartTooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'chartTooltip';
    document.body.appendChild(tooltip);
  }

 
  const showTooltip = (text, x, y) => {
    tooltip.textContent = text;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.opacity = '1';
  };
  const hideTooltip = () => {
    tooltip.style.opacity = '0';
  };

  const maxValue = Math.max(...data.map(d => d.value));

  data.forEach((d, i) => {
    const y = i * (barHeight + gap) + 30;
    const barWidth = (d.value / maxValue) * (width - leftLabelSpace - rightPadding);


    const rect = make("rect", {
      x: leftLabelSpace,
      y,
      width: barWidth,
      height: barHeight,
      fill: d.value === maxValue ? "red" : "#0ea5e9",
      rx: 4, ry: 4
    });

   
    rect.setAttribute("tabindex", "0");
    rect.setAttribute("role", "img");
    rect.setAttribute("aria-label", `${d.reason} ${d.value} percent`);

 
    const hoverFill = "#22c55e"; 
    const originalFill = rect.getAttribute("fill");

    const onEnter = (ev) => {
      rect.setAttribute("fill", hoverFill);
      const pageX = ev.pageX ?? (ev.touches && ev.touches[0]?.pageX) ?? 0;
      const pageY = ev.pageY ?? (ev.touches && ev.touches[0]?.pageY) ?? 0;
      showTooltip(`${d.reason}: ${d.value}%`, pageX + 12, pageY - 12);
    };
    const onMove = (ev) => {
      const pageX = ev.pageX ?? (ev.touches && ev.touches[0]?.pageX) ?? 0;
      const pageY = ev.pageY ?? (ev.touches && ev.touches[0]?.pageY) ?? 0;
      showTooltip(`${d.reason}: ${d.value}%`, pageX + 12, pageY - 12);
    };
    const onLeave = () => {
      rect.setAttribute("fill", originalFill);
      hideTooltip();
    };
    const onFocus = (ev) => {
      rect.setAttribute("fill", hoverFill);
    
      const bbox = rect.getBoundingClientRect();
      const pageX = window.scrollX + bbox.x + bbox.width;
      const pageY = window.scrollY + bbox.y;
      showTooltip(`${d.reason}: ${d.value}%`, pageX + 12, pageY - 12);
    };
    const onBlur = onLeave;
    const onKey = (ev) => {
      
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        onFocus(ev);
      }
     
      if (ev.key === "Escape") hideTooltip();
    };

    rect.addEventListener("mouseenter", onEnter);
    rect.addEventListener("mousemove", onMove);
    rect.addEventListener("mouseleave", onLeave);
    rect.addEventListener("focus", onFocus);
    rect.addEventListener("blur", onBlur);
    rect.addEventListener("keydown", onKey);

    svg.appendChild(rect);


    const label = make("text", {
      x: 10,
      y: y + barHeight / 2 + 5,
      "font-size": "14",
      fill: "currentColor"
    });
    label.textContent = d.reason;
    svg.appendChild(label);

   
    const valueText = make("text", {
      x: leftLabelSpace + barWidth + 5,
      y: y + barHeight / 2 + 5,
      "font-size": "12",
      fill: "currentColor"
    });
    valueText.textContent = d.value + "%";
    svg.appendChild(valueText);
  });

  
  document.getElementById("delayChart").innerHTML = ""; // 清空后再挂
  document.getElementById("delayChart").appendChild(svg);
}


// ==================== make posture pie chart ====================
function makePostureChart() {
  const data = [
    { posture: "lay", value: 5 },
    { posture: "sit", value: 15 },
    { posture: "bed", value: 5 },
    { posture: "library", value: 80 }
  ];

  const width = 400, height = 300;
  const radius = 100; 
  const cx = width / 2, cy = height / 2;

  const svg = createSVG(width, height);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = 0;

  const colors = ["#ff69b4", "#0ea5e9", "#86efac", "#facc15"];

  data.forEach((d, i) => {
    const sliceAngle = (d.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    // start and end
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    // path
    const pathData = [
      `M ${cx} ${cy}`, 
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      "Z"
    ].join(" ");

    const path = make("path", {
      d: pathData,
      fill: colors[i % colors.length]
    });
    svg.appendChild(path);

    // the position of the label text
    const midAngle = startAngle + sliceAngle / 2;
    const labelX = cx + (radius + 20) * Math.cos(midAngle);
    const labelY = cy + (radius + 20) * Math.sin(midAngle);

    const label = make("text", {
      x: labelX,
      y: labelY,
      "text-anchor": midAngle > Math.PI / 2 && midAngle < 1.5 * Math.PI ? "end" : "start",
      "font-size": "12",
      fill: "currentColor"
    });
    label.textContent = `${d.posture} (${d.value}%)`;
    svg.appendChild(label);

    startAngle = endAngle;
  });

  document.getElementById("postureChart").appendChild(svg);
}

// ==================== counting tool ====================
function createSVG(width, height) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  return svg;
}

function make(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  return el;
}

