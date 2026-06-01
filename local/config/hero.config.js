export function buildHeroBackground() {
  return '<canvas id="hero-canvas" class="hero-cosmos"></canvas>';
}

export function startHeroAnimation(setStop) {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animId;
  let time = 0;
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();

  const W = () => canvas.offsetWidth;
  const H = () => canvas.offsetHeight;

  // Colors matching 竹简素净 theme
  const bgColor = '#f4ede0';
  const inkDark = 'rgba(60, 50, 40, 0.6)';
  const inkMid = 'rgba(80, 70, 55, 0.3)';
  const inkLight = 'rgba(100, 90, 70, 0.15)';
  const cinnabar = 'rgba(168, 42, 42, 0.4)';
  const mist = 'rgba(244, 237, 224, 0.7)';

  // Draw ink-wash mountain range
  function drawMountain(yBase, amplitude, freq, color, rough) {
    const w = W();
    ctx.beginPath();
    ctx.moveTo(0, H());
    for (let x = 0; x <= w; x += 2) {
      let y = yBase;
      y += Math.sin((x * freq + time * 0.2) * 0.01) * amplitude;
      y += Math.sin((x * freq * 2.3 + time * 0.1) * 0.007) * (amplitude * 0.4);
      if (rough) {
        y += Math.sin(x * 0.3) * 3 + Math.cos(x * 0.7) * 2;
      }
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, H());
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  // Draw floating clouds/mist
  function drawCloud(cx, cy, w, h, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.fillStyle = mist;
    ctx.fill();
    ctx.restore();
  }

  // Draw a simplified phoenix/bird silhouette
  function drawBird(x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    // Wing span
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-size * 0.5, -size * 0.3, -size, -size * 0.1);
    ctx.quadraticCurveTo(-size * 0.7, size * 0.1, 0, 0);
    ctx.quadraticCurveTo(size * 0.7, size * 0.1, size, -size * 0.1);
    ctx.quadraticCurveTo(size * 0.5, -size * 0.3, 0, 0);
    // Tail
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.2, size * 0.4, 0, size * 0.8);
    ctx.quadraticCurveTo(-size * 0.1, size * 0.5, 0, 0);
    ctx.fillStyle = cinnabar;
    ctx.fill();
    ctx.restore();
  }

  // Draw a serpent/dragon silhouette
  function drawSerpent(startX, startY, len, t) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (let i = 0; i < len; i += 3) {
      const x = startX + i;
      const y = startY + Math.sin((i + t * 0.5) * 0.05) * 15;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = inkMid;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  // Seal stamp (印章) in corner
  function drawSeal() {
    const w = W(), h = H();
    const sx = w - 50, sy = h - 50;
    ctx.save();
    ctx.fillStyle = 'rgba(168, 42, 42, 0.6)';
    ctx.fillRect(sx, sy, 36, 36);
    ctx.font = 'bold 16px serif';
    ctx.fillStyle = '#f4ede0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('山', sx + 18, sy + 12);
    ctx.fillText('海', sx + 18, sy + 28);
    ctx.restore();
  }

  function draw() {
    time++;
    const w = W(), h = H();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background - warm parchment
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Far mountains (lightest)
    drawMountain(h * 0.45, h * 0.12, 0.8, inkLight, false);

    // Floating mist between layers
    const cloudX = (time * 0.3) % (w + 200) - 100;
    drawCloud(cloudX, h * 0.5, 120, 20, 0.5);
    drawCloud(w - cloudX * 0.7, h * 0.55, 90, 15, 0.4);

    // Mid mountains
    drawMountain(h * 0.58, h * 0.1, 1.2, inkMid, true);

    // Serpent/dragon in the mist
    drawSerpent(w * 0.6, h * 0.42, w * 0.25, time);

    // More mist
    drawCloud(cloudX * 1.5 % w, h * 0.65, 150, 25, 0.6);

    // Near mountains (darkest)
    drawMountain(h * 0.72, h * 0.08, 1.8, inkDark, true);

    // Birds (phoenix-like)
    const bx = w * 0.25 + Math.sin(time * 0.02) * 30;
    const by = h * 0.3 + Math.cos(time * 0.015) * 10;
    drawBird(bx, by, 20, Math.sin(time * 0.01) * 0.1);
    drawBird(bx + 40, by - 15, 14, Math.sin(time * 0.012) * 0.1 + 0.1);

    // Seal stamp
    drawSeal();

    animId = requestAnimationFrame(draw);
  }

  draw();

  function handleResize() {
    resize();
  }
  window.addEventListener('resize', handleResize);

  setStop(() => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', handleResize);
  });
}
