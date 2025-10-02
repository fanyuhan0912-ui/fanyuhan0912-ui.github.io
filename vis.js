document.addEventListener('DOMContentLoaded', ()=>{
  mountBarChart();
  mountArt();
  // 页脚年份
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

function mountBarChart(){
  const host = document.getElementById('barChartMount');
  if (!host) return;

  const data = [
    { label: 'HTML', value: 9 },
    { label: 'CSS', value: 8 },
    { label: 'JS', value: 7 },
    { label: 'p5.js', value: 6 },
    { label: 'Figma', value: 7 },
  ];

  const pad = { t: 24, r: 24, b: 48, l: 40 };
  const W = host.clientWidth || 640;
  const H = Math.max(320, host.clientHeight || 360);
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const svg = makeSVG('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height:'100%', role: 'img' });
  svg.appendChild(makeSVG('rect', { x:0, y:0, width:W, height:H, rx:14, fill:'rgba(255,255,255,0.02)' }));

  // 轴线
  svg.appendChild(makeSVG('line', { x1: pad.l, y1: H - pad.b, x2: W - pad.r, y2: H - pad.b, stroke:'rgba(255,255,255,.3)' }));

  const maxV = Math.max(...data.map(d=>d.value));
  const barW = innerW / data.length * 0.7;
  const gap = innerW / data.length * 0.3;

  data.forEach((d, i)=>{
    const x = pad.l + i*(barW+gap);
    const h = (d.value / maxV) * innerH;
    const y = H - pad.b - h;

    const g = makeSVG('g', {});

    const gradId = `g${i}`;
    const defs = makeSVG('defs',{});
    const lg = makeSVG('linearGradient', { id: gradId, x1:'0',y1:'0', x2:'0', y2:'1' });
    lg.appendChild(makeSVG('stop', { offset:'0%', stop-color:'var(--accent)'}));
    lg.appendChild(makeSVG('stop', { offset:'100%', stop-color:'var(--accent-2)'}));
    defs.appendChild(lg);
    g.appendChild(defs);

    const rect = makeSVG('rect', {
      x, y, width:barW, height:h, rx:10, fill:`url(#${gradId})`
    });
    // 动画出现
    rect.animate([{height:0, y:H - pad.b}, {height:h, y}], {duration:600, fill:'forwards', delay: i*80});
    g.appendChild(rect);

    // 标签
    g.appendChild(makeSVG('text', {
      x: x + barW/2, y: H - pad.b + 18, 'text-anchor':'middle', fill:'var(--muted)', 'font-size':'12'
    }, d.label));

    // 数值
    g.appendChild(makeSVG('text', {
      x: x + barW/2, y: y - 6, 'text-anchor':'middle', fill:'var(--text)', 'font-size':'12'
    }, d.value.toString()));

    svg.appendChild(g);
  });

  host.innerHTML = '';
  host.appendChild(svg);
}

function mountArt(){
  const host = document.getElementById('artMount');
  if (!host) return;

  const W = host.clientWidth || 640;
  const H = Math.max(320, host.clientHeight || 360);
  const cx = W/2, cy = H/2;

  const svg = makeSVG('svg', { viewBox:`0 0 ${W} ${H}`, width:'100%', height:'100%' });
  svg.appendChild(makeSVG('rect', { x:0,y:0,width:W,height:H,rx:14, fill:'rgba(255,255,255,0.02)'}));

  // 花朵样式的生成艺术（五瓣+轨道小球）
  const petals = 5;
  const R1 = Math.min(W,H)*0.18;
  const R2 = R1*0.45;

  for (let i=0;i<petals;i++){
    const a = (i/petals) * Math.PI*2;
    const px = cx + Math.cos(a)*R1;
    const py = cy + Math.sin(a)*R1;
    svg.appendChild(makeSVG('circle', {
      cx:px, cy:py, r:R2, fill:'url(#petalGrad)', opacity:.9
    }));
  }

  // 渐变定义
  const defs = makeSVG('defs',{});
  const rg = makeSVG('radialGradient', { id:'petalGrad', cx:'50%', cy:'50%', r:'50%' });
  rg.appendChild(makeSVG('stop', { offset:'0%', 'stop-color':'var(--accent-2)' }));
  rg.appendChild(makeSVG('stop', { offset:'100%', 'stop-color':'var(--accent)' }));
  defs.appendChild(rg);
  svg.appendChild(defs);

  // 中心
  svg.appendChild(makeSVG('circle', { cx, cy, r:R2*0.9, fill:'var(--text)', opacity:.1 }));

  // 轨道与小球动画
  const orbitR = Math.min(W,H)*0.28;
  const orb = makeSVG('circle', { cx, cy, r:orbitR, fill:'none', stroke:'rgba(255,255,255,.15)' });
  svg.appendChild(orb);

  const ball = makeSVG('circle', { cx: cx+orbitR, cy, r:6, fill:'var(--accent)' });
  svg.appendChild(ball);

  let t0 = performance.now();
  (function tick(t){
    const dt = (t - t0)/1000;
    const angle = dt * 0.9; // rad/s
    const x = cx + Math.cos(angle)*orbitR;
    const y = cy + Math.sin(angle)*orbitR;
    ball.setAttribute('cx', x.toFixed(2));
    ball.setAttribute('cy', y.toFixed(2));
    requestAnimationFrame(tick);
  })(t0);

  host.innerHTML = '';
  host.appendChild(svg);
}

function makeSVG(tag, attrs={}, text){
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (text != null) el.textContent = text;
  return el;
}
