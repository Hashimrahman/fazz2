(() => {
  // ---------- Floating hearts background canvas ----------
  const canvas = document.getElementById('hearts-bg');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function drawHeart(x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.scale(size / 30, size / 30);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.bezierCurveTo(0, -3, -15, -3, -15, 8);
    ctx.bezierCurveTo(-15, 18, 0, 25, 0, 32);
    ctx.bezierCurveTo(0, 25, 15, 18, 15, 8);
    ctx.bezierCurveTo(15, -3, 0, -3, 0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const palette = ['#ff4fa3', '#ff86b8', '#ffd1e6', '#b88bff', '#66e0ff'];
  const hearts = [];
  const HEART_COUNT = Math.min(60, Math.floor((W * H) / 22000));

  function spawnHeart(initial = false) {
    hearts.push({
      x: Math.random() * W,
      y: initial ? Math.random() * H : H + 20,
      size: 8 + Math.random() * 22,
      speed: 0.3 + Math.random() * 1.1,
      drift: (Math.random() - 0.5) * 0.6,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.015,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.25 + Math.random() * 0.55,
      rot: Math.random() * Math.PI * 2,
    });
  }
  for (let i = 0; i < HEART_COUNT; i++) spawnHeart(true);

  // ---------- Sparkles (small twinkles) ----------
  const sparks = [];
  for (let i = 0; i < 80; i++) {
    sparks.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      tw: Math.random() * Math.PI * 2,
      twSpeed: 0.01 + Math.random() * 0.04,
    });
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    // sparkles
    for (const s of sparks) {
      s.tw += s.twSpeed;
      const a = 0.3 + Math.abs(Math.sin(s.tw)) * 0.7;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = '#ffe8f4';
      ctx.shadowColor = '#ff9ed1';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // hearts
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.sway += h.swaySpeed;
      h.y -= h.speed;
      h.x += Math.sin(h.sway) * 0.6 + h.drift;
      drawHeart(h.x, h.y, h.size, h.color, h.alpha);
      if (h.y < -40 || h.x < -40 || h.x > W + 40) {
        hearts.splice(i, 1);
        spawnHeart();
      }
    }

    requestAnimationFrame(tick);
  }
  tick();

  // ---------- Parallax tilt on cube ----------
  const stage = document.querySelector('.stage');
  let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetRY = ((e.clientX - cx) / cx) * 12;
    targetRX = -((e.clientY - cy) / cy) * 12;
  });

  function tilt() {
    curRX += (targetRX - curRX) * 0.06;
    curRY += (targetRY - curRY) * 0.06;
    if (stage) {
      stage.style.transform = `rotateX(${curRX}deg) rotateY(${curRY}deg)`;
    }
    requestAnimationFrame(tilt);
  }
  tilt();

  // ---------- Click burst hearts ----------
  const emojis = ['💗', '💖', '💘', '💕', '✨', '🌸'];

  function burstAt(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'burst';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const dist = 80 + Math.random() * 120;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--dy', Math.sin(angle) * dist - 40 + 'px');
      el.style.fontSize = (16 + Math.random() * 20) + 'px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }

  window.addEventListener('click', (e) => burstAt(e.clientX, e.clientY));
  window.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (t) burstAt(t.clientX, t.clientY);
  }, { passive: true });
})();
