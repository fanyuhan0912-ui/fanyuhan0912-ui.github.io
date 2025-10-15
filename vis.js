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
    { posture: "lay", value: 5, emoji: "🛌" },
    { posture: "sit", value: 15, emoji: "🪑" },
    { posture: "bed", value: 5, emoji: "🛏️" },
    { posture: "library", value: 80, emoji: "📚" }
  ];

  const width = 480, height = 360;
  const cx = width / 2, cy = height / 2;
  const outerR = 120;         
  const innerR = 70;          
  const labelR = outerR + 18; 
  const iconR = outerR + 42;  

  const svg = createSVG(width, height);

  
  const defs = make("defs", {});

  
  const gradients = [
    ["grad0", "#8ec5ff", "#3aa0ff"],
    ["grad1", "#b1f0a1", "#57d26b"],
    ["grad2", "#ffd199", "#ff9f43"],
    ["grad3", "#f9a8d4", "#ec4899"]
  ];
  gradients.forEach(([id, c1, c2]) => {
    const g = make("linearGradient", { id, x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
    const s1 = make("stop", { offset: "0%", "stop-color": c1, "stop-opacity": 0.9 });
    const s2 = make("stop", { offset: "100%", "stop-color": c2, "stop-opacity": 1 });
    g.appendChild(s1); g.appendChild(s2);
    defs.appendChild(g);
  });

  const pattern = make("pattern", {
    id: "slimHatch",
    width: "6", height: "6", patternUnits: "userSpaceOnUse",
    patternTransform: "rotate(30)"
  });
  const hatch = make("rect", { x: 0, y: 0, width: 2, height: 6, fill: "rgba(255,255,255,0.22)" });
  pattern.appendChild(hatch);
  defs.appendChild(pattern);


  const filter = make("filter", { id: "softShadow", x: "-20%", y: "-20%", width: "140%", height: "140%" });
  filter.appendChild(make("feDropShadow", {
    dx: "0", dy: "2", stdDeviation: "3",
    "flood-color": "#000000", "flood-opacity": "0.25"
  }));
  defs.appendChild(filter);


  const badgeGrad = make("radialGradient", { id: "badgeGrad", cx: "50%", cy: "45%", r: "65%" });
  badgeGrad.appendChild(make("stop", { offset: "0%", "stop-color": "#ffffff", "stop-opacity": 0.95 }));
  badgeGrad.appendChild(make("stop", { offset: "100%", "stop-color": "#d1d5db", "stop-opacity": 1 }));
  defs.appendChild(badgeGrad);

  svg.appendChild(defs);

  
  const bgRing = make("circle", {
    cx, cy, r: outerR + 18,
    fill: "none",
    stroke: "currentColor",
    "stroke-opacity": "0.12",
    "stroke-width": 1.5
  });
  svg.appendChild(bgRing);

  const total = data.reduce((s, d) => s + d.value, 0);
  let acc = 0; 


  const polar = (r, ang) => [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];


  data.forEach((d, i) => {
    const start = acc;
    const slice = (d.value / total) * Math.PI * 2;
    const end = start + slice;
    acc = end;

    const large = slice > Math.PI ? 1 : 0;

  
    const [x1, y1] = polar(outerR, start);
    const [x2, y2] = polar(outerR, end);
  
    const [x3, y3] = polar(innerR, end);
    const [x4, y4] = polar(innerR, start);

  
    const dPath = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4}`,
      "Z"
    ].join(" ");

 
    const g = make("g", { filter: "url(#softShadow)" });

  
    const slicePath = make("path", {
      d: dPath,
      fill: `url(#grad${i % gradients.length})`
    });
    g.appendChild(slicePath);


    const texture = make("path", {
      d: dPath,
      fill: "url(#slimHatch)",
      opacity: "0.35"
    });
    g.appendChild(texture);


    const innerHighlight = make("path", {
      d: [
        `M ${x3} ${y3}`,
        `A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4}`
      ].join(" "),
      fill: "none",
      stroke: "#fff",
      "stroke-opacity": "0.35",
      "stroke-width": 1.2
    });
    g.appendChild(innerHighlight);


    g.setAttribute("transform-origin", `${cx} ${cy}`);
    const anim = make("animateTransform", {
      attributeName: "transform",
      type: "scale",
      from: "0.92 0.92",
      to: "1 1",
      dur: "320ms",
      begin: `${i * 90}ms`,
      fill: "freeze"
    });
    g.appendChild(anim);

    svg.appendChild(g);

   
    const midForLabel = start + slice / 2;
    const labelStart = start + 0.10;
    const labelEnd = end - 0.10;
    const [lx1, ly1] = polar(labelR, labelStart);
    const [lx2, ly2] = polar(labelR, labelEnd);
    const labelLarge = (labelEnd - labelStart) > Math.PI ? 1 : 0;

    const labelPathId = `labelArc-${i}`;
    const labelPath = make("path", {
      id: labelPathId,
      d: `M ${lx1} ${ly1} A ${labelR} ${labelR} 0 ${labelLarge} 1 ${lx2} ${ly2}`,
      fill: "none",
      stroke: "none"
    });
    svg.appendChild(labelPath);


    const text = make("text", {
      "font-size": "12",
      "font-weight": "600",
      fill: "currentColor"
    });
    const textPath = make("textPath", {
      href: `#${labelPathId}`,
      startOffset: "50%",
      "text-anchor": "middle"
    });
    textPath.textContent = `${d.posture} • ${d.value}%`;
    text.appendChild(textPath);
    svg.appendChild(text);

 
    const [ix, iy] = polar(iconR, midForLabel);
    const icon = make("text", {
      x: ix, y: iy,
      "font-size": "18",
      "text-anchor": "middle",
      "dominant-baseline": "central"
    });
    icon.textContent = d.emoji;
    svg.appendChild(icon);
  });


  const badge = make("g", {});
  badge.appendChild(make("circle", {
    cx, cy, r: innerR - 10,
    fill: "url(#badgeGrad)",
    stroke: "rgba(0,0,0,.08)",
    "stroke-width": 1
  }));
  const title = make("text", {
    x: cx, y: cy - 4,
    "text-anchor": "middle",
    "font-size": "13",
    "font-weight": "700",
    fill: "currentColor"
  });
  title.textContent = "Study Posture";
  const sub = make("text", {
    x: cx, y: cy + 14,
    "text-anchor": "middle",
    "font-size": "11",
    fill: "currentColor",
    "opacity": "0.7"
  });
  sub.textContent = `Total ${total}%`;
  badge.appendChild(title);
  badge.appendChild(sub);
  svg.appendChild(badge);


  const mount = document.getElementById("postureChart");
  mount.innerHTML = "";
  mount.appendChild(svg);
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

