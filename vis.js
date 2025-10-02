document.addEventListener("DOMContentLoaded", () => {
  makeBarChart();
  makeArt();
});

// ==================== 柱状图 ====================
function makeBarChart() {
  const data = [
    { skill: "HTML", value: 9 },
    { skill: "CSS", value: 8 },
    { skill: "JavaScript", value: 7 },
    { skill: "p5.js", value: 6 }
  ];

  const width = 400, height = 300;
  const svg = createSVG(width, height);

  const barWidth = 60;
  const gap = 20;
  const maxValue = Math.max(...data.map(d => d.value));

  data.forEach((d, i) => {
    const barHeight = (d.value / maxValue) * (height - 50);
    const x = i * (barWidth + gap) + 40;
    const y = height - barHeight - 20;

    // 柱子
    const rect = make("rect", {
      x, y,
      width: barWidth,
      height: barHeight,
      fill: "skyblue"
    });
    svg.appendChild(rect);

    // 标签
    const label = make("text", {
      x: x + barWidth / 2,
      y: height - 5,
      "text-anchor": "middle",
      "font-size": "12",
      fill: "black"
    });
    label.textContent = d.skill;
    svg.appendChild(label);

    // 数值
    const value = make("text", {
      x: x + barWidth / 2,
      y: y - 5,
      "text-anchor": "middle",
      "font-size": "12",
      fill: "black"
    });
    value.textContent = d.value;
    svg.appendChild(value);
  });

  document.getElementById("chart").appendChild(svg);
}

// ==================== 创意艺术 ====================
function makeArt() {
  const width = 300, height = 300;
  const svg = createSVG(width, height);

  const cx = width / 2, cy = height / 2;
  const petals = 6, radius = 100;

  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * 2 * Math.PI;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    const circle = make("circle", {
      cx: x,
      cy: y,
      r: 40,
      fill: "pink",
      opacity: 0.7
    });
    svg.appendChild(circle);
  }

  // 中心
  const center = make("circle", {
    cx, cy, r: 50, fill: "yellow"
  });
  svg.appendChild(center);

  document.getElementById("art").appendChild(svg);
}

// ==================== 工具函数 ====================
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
