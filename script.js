const W = 1080,
  H = 1400,
  CX = 270,
  CY = 800,
  R = 200,
  NAVY = "#0a1f5c",
  DISP = "Anton,Impact,'Arial Narrow',sans-serif";
const c = document.getElementById("c"),
  ctx = c.getContext("2d");
const nameEl = document.getElementById("name"),
  photoEl = document.getElementById("photo"),
  zoomEl = document.getElementById("zoom"),
  makeBtn = document.querySelector("button[type='submit']");
let user = null,
  ox = 0,
  oy = 0;
const L1 = new Image(),
  L2 = new Image();
L1.src = "logo1.jpg";
L2.src = "logo2.jpg";
L1.onload = L2.onload = () => draw();

function fit(t, font, maxW, start) {
  let s = start;
  do {
    ctx.font = font(s);
    s--;
  } while (ctx.measureText(t).width > maxW && s > 10);
  return s + 1;
}
function txt(t, x, y, size, color, weight, align, family) {
  ctx.letterSpacing = "0px";
  ctx.font = `${weight || "bold"} ${size}px ${family || "Arial,sans-serif"}`;
  ctx.fillStyle = color;
  ctx.textAlign = align || "center";
  ctx.fillText(t, x, y);
}

function sky() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#1f7fd6");
  g.addColorStop(0.55, "#7ec3f2");
  g.addColorStop(1, "#d6eefc");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  [
    [900, 520, 260],
    [120, 470, 220],
    [980, 1000, 300],
    [560, 980, 260],
    [40, 1250, 240],
    [800, 1300, 260],
    [500, 300, 200],
  ].forEach(([x, y, r]) => {
    const q = ctx.createRadialGradient(x, y, 0, x, y, r);
    q.addColorStop(0, "rgba(255,255,255,.85)");
    q.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = q;
    ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  });
}
function banner() {
  const g = ctx.createLinearGradient(0, 0, 0, 380);
  g.addColorStop(0, "#d4181f");
  g.addColorStop(1, "#7a0a10");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(70, 0);
  ctx.lineTo(290, 0);
  ctx.lineTo(290, 360);
  ctx.lineTo(180, 380);
  ctx.lineTo(70, 360);
  ctx.closePath();
  ctx.fill();
  txt("DATE:", 180, 50, 20, "#fff", "600");
  txt("FRI", 180, 108, 66, "#fff", "900");
  txt("16", 180, 198, 104, "#fff", "900");
  txt("OCT", 180, 252, 54, "#fff", "900");
  txt("2026", 180, 292, 32, "#fff", "600");
  ctx.fillStyle = "#f6c21a";
  ctx.beginPath();
  ctx.roundRect(95, 306, 170, 44, 22);
  ctx.fill();
  txt("6PM/6AM", 180, 337, 23, "#7a0a10", "700");
}
function logo(img, x, y, s) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, s / 2, 0, 7);
  ctx.clip();
  if (img.complete) ctx.drawImage(img, x - s / 2, y - s / 2, s, s);
  ctx.restore();
}
function header() {
  logo(L1, 610, 125, 110);
  logo(L2, 760, 125, 110);
  txt("The Youth Fellowship of", 690, 235, 34, NAVY, "italic bold");
  txt("REDEEMED PEOPLE OF", 690, 288, 46, NAVY, "900");
  txt("CHRIST ASSEMBLY", 690, 340, 46, NAVY, "900");
  ctx.save();
  ctx.font = "bold 30px Arial,sans-serif";
  ctx.letterSpacing = "6px";
  txt("PRESENTS:", 600, 418, 30, "#6b0b10", "900");
  ctx.restore();
  ctx.fillStyle = "#1f9d3a";
  ctx.fillRect(138, 448, 880, 92);
  ctx.fillStyle = "#a8121a";
  ctx.fillRect(130, 440, 880, 92);
  const f = (s) => `${s}px ${DISP}`,
    a = "12 HOURS ",
    b = "PRAYER CHARGE";
  const s = fit(a + b, f, 820, 64);
  ctx.font = f(s);
  const wa = ctx.measureText(a).width,
    wb = ctx.measureText(b).width,
    x0 = 570 - (wa + wb) / 2;
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffd21f";
  ctx.fillText(a, x0, 508);
  ctx.fillStyle = "#fff";
  ctx.fillText(b, x0 + wa, 508);
}
function title() {
  const f = (s) => `${s}px ${DISP}`;
  ctx.lineJoin = "round";
  ctx.textAlign = "center";
  let s = fit("OPEN", f, 400, 140);
  ctx.font = f(s);
  ctx.lineWidth = 18;
  ctx.strokeStyle = "#fff";
  ctx.strokeText("OPEN", 770, 700);
  const g = ctx.createLinearGradient(0, 590, 0, 700);
  g.addColorStop(0, "#0a2a8c");
  g.addColorStop(0.5, "#1c6bff");
  g.addColorStop(1, "#071a66");
  ctx.fillStyle = g;
  ctx.fillText("OPEN", 770, 700);
  s = fit("HEAVENS", f, 540, 190);
  ctx.font = f(s);
  ctx.lineWidth = 22;
  ctx.strokeStyle = "#fff";
  ctx.strokeText("HEAVENS", 770, 870);
  ctx.fillStyle = "#050a1a";
  ctx.fillText("HEAVENS", 770, 870);
  txt("Matthew 3:16, Ezekiel 1:1", 770, 920, 22, NAVY, "italic bold");
}
function photo() {
  ctx.save();
  ctx.shadowColor = "rgba(0,30,90,.45)";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(CX, CY, R + 14, 0, 7);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, R, 0, 7);
  ctx.clip();
  if (user) {
    const s = photoScale(),
      w = user.width * s,
      h = user.height * s;
    const mx = Math.max(0, (w - 2 * R) / 2),
      my = Math.max(0, (h - 2 * R) / 2);
    ox = Math.max(-mx, Math.min(mx, ox));
    oy = Math.max(-my, Math.min(my, oy));
    ctx.drawImage(user, CX - w / 2 + ox, CY - h / 2 + oy, w, h);
  } else {
    ctx.fillStyle = "#cfe6fa";
    ctx.fillRect(CX - R, CY - R, 2 * R, 2 * R);
    txt("Your photo here", CX, CY + 8, 28, "#4f6d92", "600");
  }
  ctx.restore();
}
function footer() {
  const t = (nameEl.value.trim() || "YOUR NAME").toUpperCase();
  txt("I", 80, 1067, 52, NAVY, "900");
  const f = (s) => `bold ${s}px Arial,sans-serif`;
  const s = fit(t, f, 820, 60);
  txt(t, 580, 1067, s, "#b3131b", "900");
  ctx.fillStyle = NAVY;
  ctx.fillRect(120, 1085, 880, 4);
  txt("WILL BE ATTENDING", 540, 1143, 50, NAVY, "normal", "center", DISP);
  txt(
    "THE 12 HOURS PRAYER CHARGE",
    540,
    1198,
    50,
    "#b3131b",
    "normal",
    "center",
    DISP,
  );
  txt("CHURCH AUDITORIUM", 540, 1247, 36, NAVY, "900");
  txt("10, Adebayo Street, Off Poly Road, Ibadan", 540, 1287, 28, NAVY, "600");
  txt("Pastor Olufisayo Mayokun / Host", 540, 1323, 28, NAVY, "600");
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(110, 1337, 860, 44, 22);
  ctx.fill();
  txt(
    "RPC Assembly, Sango, Ibadan, Nigeria  |  Youtube.com/rpcassembly",
    540,
    1366,
    22,
    NAVY,
    "600",
  );
}
function draw() {
  ctx.clearRect(0, 0, W, H);
  sky();
  banner();
  header();
  title();
  photo();
  footer();
}
if (document.fonts) {
  document.fonts
    .load("60px Anton")
    .then(draw)
    .catch(() => {});
}
draw();

photoEl.onchange = () => {
  const f = photoEl.files[0];
  if (!f) return;
  const u = URL.createObjectURL(f),
    i = new Image();
  i.onload = () => {
    user = i;
    ox = oy = 0;
    zoomEl.value = 1;
    pxEl.value = 0;
    pyEl.value = 0;
    draw();
    updateOutputs();
    URL.revokeObjectURL(u);
  };
  i.src = u;
};
nameEl.oninput = draw;
zoomEl.oninput = () => {
  draw();
  syncPos();
  updateOutputs();
};

const pxEl = document.getElementById("px"),
  pyEl = document.getElementById("py"),
  resetBtn = document.getElementById("reset"),
  xoEl = document.getElementById("xo"),
  yoEl = document.getElementById("yo"),
  zoEl = document.getElementById("zo");

function photoScale() {
  const base = Math.max((2 * R) / user.width, (2 * R) / user.height);
  return base * 1.25 * (+zoomEl.value);
}

function maxOff() {
  if (!user) return { mx: 0, my: 0 };
  const s = photoScale(),
    w = user.width * s,
    h = user.height * s;
  return {
    mx: Math.max(0, (w - 2 * R) / 2),
    my: Math.max(0, (h - 2 * R) / 2),
  };
}

function syncPos() {
  const { mx, my } = maxOff();
  pxEl.value = mx ? Math.round((ox / mx) * 100) : 0;
  pyEl.value = my ? Math.round((oy / my) * 100) : 0;
}

function updateOutputs() {
  xoEl.textContent = Math.round(+pxEl.value);
  yoEl.textContent = Math.round(+pyEl.value);
  zoEl.textContent = (+zoomEl.value).toFixed(1) + "\u00d7";
}

pxEl.oninput = () => {
  const { mx } = maxOff();
  ox = (+pxEl.value / 100) * mx;
  draw();
  updateOutputs();
};

pyEl.oninput = () => {
  const { my } = maxOff();
  oy = (+pyEl.value / 100) * my;
  draw();
  updateOutputs();
};

resetBtn.onclick = () => {
  ox = oy = 0;
  zoomEl.value = 1;
  pxEl.value = 0;
  pyEl.value = 0;
  draw();
  updateOutputs();
};
