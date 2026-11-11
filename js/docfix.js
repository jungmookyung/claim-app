/* 첨부 서류 정리 — 서류 모서리 찾기 → 반듯하게 펴기 → 흑백 선명하게 (모두 폰 화면 안에서 처리)
   window.DocFix.auto(img) → {quad, conf}
   window.DocFix.render(img, quad, {bw:true, maxSide:1800}) → canvas
   window.DocFix.editor(img, quad, opts) → Promise<{quad, bw} | null>   (모서리 맞추기 화면) */
(function () {
  'use strict';

  // ---------- 모서리 자동 찾기: 밝은 종이 영역의 가장 큰 덩어리 → 네 꼭짓점
  function auto(img) {
    const W0 = img.naturalWidth || img.width, H0 = img.naturalHeight || img.height;
    const s = Math.min(1, 360 / Math.max(W0, H0)), w = Math.max(8, Math.round(W0 * s)), h = Math.max(8, Math.round(H0 * s));
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    cx.filter = 'blur(1.5px)'; cx.drawImage(img, 0, 0, w, h);
    const d = cx.getImageData(0, 0, w, h).data, g = new Uint8Array(w * h), hist = new Uint32Array(256);
    for (let i = 0, j = 0; i < g.length; i++, j += 4) { const v = (d[j] * 299 + d[j + 1] * 587 + d[j + 2] * 114) / 1000 | 0; g[i] = v; hist[v]++; }
    // Otsu 임계값
    let sum = 0; for (let i = 0; i < 256; i++) sum += i * hist[i];
    let sB = 0, wB = 0, best = 0, th = 128; const tot = g.length;
    for (let i = 0; i < 256; i++) { wB += hist[i]; if (!wB) continue; const wF = tot - wB; if (!wF) break; sB += i * hist[i];
      const mB = sB / wB, mF = (sum - sB) / wF, v = wB * wF * (mB - mF) * (mB - mF); if (v > best) { best = v; th = i; } }
    // 밝은 영역 연결 덩어리 중 가장 큰 것 (가장자리 4방향 탐색)
    const lab = new Int32Array(w * h).fill(-1); let bestId = -1, bestN = 0; const stack = new Int32Array(w * h);
    for (let p = 0, id = 0; p < g.length; p++) {
      if (lab[p] !== -1 || g[p] <= th) continue;
      let sp = 0, n = 0; stack[sp++] = p; lab[p] = id;
      while (sp) { const q = stack[--sp]; n++; const x = q % w, y = (q / w) | 0;
        if (x > 0 && lab[q - 1] === -1 && g[q - 1] > th) { lab[q - 1] = id; stack[sp++] = q - 1; }
        if (x < w - 1 && lab[q + 1] === -1 && g[q + 1] > th) { lab[q + 1] = id; stack[sp++] = q + 1; }
        if (y > 0 && lab[q - w] === -1 && g[q - w] > th) { lab[q - w] = id; stack[sp++] = q - w; }
        if (y < h - 1 && lab[q + w] === -1 && g[q + w] > th) { lab[q + w] = id; stack[sp++] = q + w; } }
      if (n > bestN) { bestN = n; bestId = id; } id++;
    }
    const full = [[0, 0], [W0, 0], [W0, H0], [0, H0]];
    if (bestId < 0 || bestN < w * h * 0.15) return { quad: full, conf: 0 };
    let tl = [0, 0, Infinity], tr = [0, 0, -Infinity], br = [0, 0, -Infinity], bl = [0, 0, Infinity];
    for (let p = 0; p < lab.length; p++) {
      if (lab[p] !== bestId) continue; const x = p % w, y = (p / w) | 0;
      if (x + y < tl[2]) tl = [x, y, x + y]; if (x + y > br[2]) br = [x, y, x + y];
      if (x - y > tr[2]) tr = [x, y, x - y]; if (x - y < bl[2]) bl = [x, y, x - y];
    }
    const q = [tl, tr, br, bl].map(([x, y]) => [(x + 0.5) / s, (y + 0.5) / s]);
    const area = polyArea(q), touches = q.filter(([x, y]) => x < W0 * 0.01 && y < H0 * 0.01).length;
    // 덩어리가 사진 전체를 덮으면(배경이 밝은 경우) 확신 낮음
    const ratio = area / (W0 * H0), fill = bestN / (w * h) / Math.max(ratio, 1e-6);
    const conf = ratio > 0.97 || ratio < 0.2 || !convex(q) ? 0.2 : Math.min(1, fill) * (touches ? 0.5 : 1);
    return { quad: conf < 0.35 ? full : q, conf };
  }
  function polyArea(q) { let a = 0; for (let i = 0; i < 4; i++) { const [x1, y1] = q[i], [x2, y2] = q[(i + 1) % 4]; a += x1 * y2 - x2 * y1; } return Math.abs(a) / 2; }
  function convex(q) { let sg = 0; for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4], c = q[(i + 2) % 4];
      const z = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if (!z) continue; const s = Math.sign(z); if (sg && s !== sg) return false; sg = s; } return true; }

  // ---------- 원근 보정 (출력 → 원본 좌표 호모그래피, 쌍선형 보간)
  function homography(src, dst) { // dst 좌표를 src 좌표로 보내는 3x3
    const A = [], b = [];
    for (let i = 0; i < 4; i++) { const [x, y] = dst[i], [u, v] = src[i];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v); }
    const n = 8; // 가우스 소거
    for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
      for (let r = c + 1; r < n; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k < n; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; } }
    const x = new Array(n); for (let r = n - 1; r >= 0; r--) { let s = b[r]; for (let k = r + 1; k < n; k++) s -= A[r][k] * x[k]; x[r] = s / A[r][r]; }
    return [...x, 1];
  }
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

  function render(img, quad, opt) {
    opt = opt || {};
    const maxSide = opt.maxSide || 1800, W0 = img.naturalWidth || img.width, H0 = img.naturalHeight || img.height;
    let ow = Math.max(dist(quad[0], quad[1]), dist(quad[3], quad[2])), oh = Math.max(dist(quad[0], quad[3]), dist(quad[1], quad[2]));
    const k = Math.min(1, maxSide / Math.max(ow, oh)); ow = Math.max(16, Math.round(ow * k)); oh = Math.max(16, Math.round(oh * k));
    // 원본을 너무 크면 줄여서 읽기
    const rs = Math.min(1, 2600 / Math.max(W0, H0)), sw = Math.round(W0 * rs), sh = Math.round(H0 * rs);
    const sc = document.createElement('canvas'); sc.width = sw; sc.height = sh;
    const scx = sc.getContext('2d', { willReadFrequently: true }); scx.drawImage(img, 0, 0, sw, sh);
    const sd = scx.getImageData(0, 0, sw, sh).data;
    const Hm = homography(quad.map(([x, y]) => [x * rs, y * rs]), [[0, 0], [ow, 0], [ow, oh], [0, oh]]);
    const out = document.createElement('canvas'); out.width = ow; out.height = oh;
    const ocx = out.getContext('2d'), od = ocx.createImageData(ow, oh), o = od.data, gray = new Float32Array(ow * oh);
    for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) {
      const zz = Hm[6] * x + Hm[7] * y + 1, u = (Hm[0] * x + Hm[1] * y + Hm[2]) / zz, v = (Hm[3] * x + Hm[4] * y + Hm[5]) / zz;
      let val = 255;
      if (u >= 0 && v >= 0 && u < sw - 1 && v < sh - 1) {
        const x0 = u | 0, y0 = v | 0, fx = u - x0, fy = v - y0, i = (y0 * sw + x0) * 4, j = i + sw * 4;
        const L = p => (sd[p] * 0.299 + sd[p + 1] * 0.587 + sd[p + 2] * 0.114);
        val = (L(i) * (1 - fx) + L(i + 4) * fx) * (1 - fy) + (L(j) * (1 - fx) + L(j + 4) * fx) * fy;
      }
      gray[y * ow + x] = val;
    }
    if (opt.bw !== false) enhance(gray, ow, oh);
    for (let i = 0, j = 0; i < gray.length; i++, j += 4) { const v = gray[i] < 0 ? 0 : gray[i] > 255 ? 255 : gray[i]; o[j] = o[j + 1] = o[j + 2] = v; o[j + 3] = 255; }
    ocx.putImageData(od, 0, 0);
    return out;
  }

  // 흑백 선명화: 그림자·누런 종이를 걷어내고(배경 평탄화) 글씨를 진하게
  function enhance(g, w, h) {
    const r = Math.max(8, Math.round(Math.max(w, h) / 28)), I = new Float64Array((w + 1) * (h + 1));
    for (let y = 0; y < h; y++) { let row = 0; for (let x = 0; x < w; x++) { row += g[y * w + x]; I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + row; } }
    const bg = new Float32Array(w * h);
    for (let y = 0; y < h; y++) { const y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1);
      for (let x = 0; x < w; x++) { const x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1);
        const s = I[y1 * (w + 1) + x1] - I[y0 * (w + 1) + x1] - I[y1 * (w + 1) + x0] + I[y0 * (w + 1) + x0];
        bg[y * w + x] = s / ((x1 - x0) * (y1 - y0)); } }
    for (let i = 0; i < g.length; i++) {
      let v = g[i] / Math.max(bg[i] * 1.02, 30);           // 배경 대비 밝기 (1 = 종이)
      v = v >= 0.92 ? 1 : v <= 0.55 ? 0 : (v - 0.55) / 0.37; // 종이는 하얗게, 글씨는 진하게
      g[i] = Math.pow(v, 1.6) * 255;
    }
  }

  // ---------- 모서리 맞추기 화면
  function editor(img, quad, opt) {
    opt = opt || {};
    return new Promise(resolve => {
      const W0 = img.naturalWidth || img.width, H0 = img.naturalHeight || img.height;
      const wrap = document.createElement('div');
      wrap.className = 'dfx'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true');
      wrap.innerHTML = `<div class="dfx-in">
        <div class="dfx-head"><b>모서리 맞추기</b><span>파란 점 4개를 서류 네 귀퉁이에 맞춰 주세요</span></div>
        <div class="dfx-stage"><canvas></canvas></div>
        <label class="dfx-bw"><input type="checkbox" ${opt.bw === false ? '' : 'checked'}> 흑백 선명하게 (팩스용)</label>
        <div class="dfx-acts"><button data-a="auto">자동 찾기</button><button data-a="full">사진 전체</button><button data-a="close">닫기</button><button class="blue" data-a="ok">이대로 펴기</button></div>
      </div>`;
      document.body.appendChild(wrap); document.body.classList.add('locked');
      const cv = wrap.querySelector('canvas'), stage = wrap.querySelector('.dfx-stage'), cx = cv.getContext('2d');
      let q = quad.map(p => p.slice()), drag = -1, scale = 1;
      function layout() {
        const maxW = stage.clientWidth || 360, maxH = Math.max(240, window.innerHeight - 260);
        scale = Math.min(maxW / W0, maxH / H0); const dpr = window.devicePixelRatio || 1;
        cv.style.width = Math.round(W0 * scale) + 'px'; cv.style.height = Math.round(H0 * scale) + 'px';
        cv.width = Math.round(W0 * scale * dpr); cv.height = Math.round(H0 * scale * dpr); cx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0); draw();
      }
      function draw() {
        cx.clearRect(0, 0, W0, H0); cx.drawImage(img, 0, 0, W0, H0);
        cx.save(); cx.fillStyle = 'rgba(15,25,50,.45)'; cx.beginPath(); cx.rect(0, 0, W0, H0);
        cx.moveTo(q[0][0], q[0][1]); for (let i = 3; i >= 0; i--) cx.lineTo(q[i][0], q[i][1]); cx.closePath(); cx.fill('evenodd');
        cx.strokeStyle = '#2f7bff'; cx.lineWidth = 3 / scale; cx.beginPath(); q.forEach((p, i) => i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1])); cx.closePath(); cx.stroke();
        q.forEach(p => { cx.beginPath(); cx.arc(p[0], p[1], 13 / scale, 0, Math.PI * 2); cx.fillStyle = 'rgba(47,123,255,.25)'; cx.fill();
          cx.beginPath(); cx.arc(p[0], p[1], 7 / scale, 0, Math.PI * 2); cx.fillStyle = '#2f7bff'; cx.fill(); cx.lineWidth = 2 / scale; cx.strokeStyle = '#fff'; cx.stroke(); });
        cx.restore();
      }
      const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / scale, (e.clientY - r.top) / scale]; };
      cv.addEventListener('pointerdown', e => { const p = pos(e); let bi = -1, bd = 40 / scale;
        q.forEach((c, i) => { const d = Math.hypot(c[0] - p[0], c[1] - p[1]); if (d < bd) { bd = d; bi = i; } });
        if (bi >= 0) { drag = bi; try { cv.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault(); } });
      cv.addEventListener('pointermove', e => { if (drag < 0) return; const p = pos(e); q[drag] = [Math.max(0, Math.min(W0, p[0])), Math.max(0, Math.min(H0, p[1]))]; draw(); e.preventDefault(); });
      const up = () => { drag = -1; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      const done = v => { window.removeEventListener('resize', layout); wrap.remove(); if (!document.querySelector('.ov:not([hidden]), .mo:not([hidden])')) document.body.classList.remove('locked'); resolve(v); };
      wrap.addEventListener('click', e => { const a = e.target.dataset.a; if (!a) return;
        if (a === 'auto') { q = auto(img).quad.map(p => p.slice()); draw(); }
        if (a === 'full') { q = [[0, 0], [W0, 0], [W0, H0], [0, H0]]; draw(); }
        if (a === 'close') done(null);
        if (a === 'ok') done({ quad: q, bw: wrap.querySelector('.dfx-bw input').checked }); });
      window.addEventListener('resize', layout); requestAnimationFrame(layout);
    });
  }

  window.DocFix = { auto, render, editor };
})();
