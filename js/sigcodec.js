/* 원격 서명용 인코딩 — 서버 없이 카톡 링크로 주고받는다.
   요청 링크: sign/#r=<압축 JSON>   (주소의 # 뒤는 어떤 서버로도 전송되지 않음)
   답장 링크: ./#s=<압축 JSON>      (서명은 획 좌표로 담아 짧게) */
(function () {
  'use strict';
  const te = new TextEncoder(), td = new TextDecoder();
  const b64u = u8 => { let s = ''; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192));
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64u = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
  async function stream(u8, T) { const s = new Blob([u8]).stream().pipeThrough(new T('deflate-raw')); return new Uint8Array(await new Response(s).arrayBuffer()); }
  // plain=true: 압축 없이 (고객 폰이 오래된 아이폰이어도 열리게 — 서명 요청 링크용)
  async function pack(obj, plain) {
    const raw = te.encode(JSON.stringify(obj));
    if (!plain && window.CompressionStream) { try { return 'z' + b64u(await stream(raw, CompressionStream)); } catch (_) {} }
    return 'j' + b64u(raw);
  }
  async function unpack(str) {
    const kind = str[0], body = unb64u(str.slice(1));
    const raw = kind === 'z' ? await stream(body, DecompressionStream) : body;
    return JSON.parse(td.decode(raw));
  }
  async function sha(s) { const d = await crypto.subtle.digest('SHA-256', te.encode(s)); return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 24); }

  // 획 단순화(RDP) + 정수화 + 차분
  function rdp(pts, eps) {
    if (pts.length < 3) return pts;
    const [a, b] = [pts[0], pts[pts.length - 1]]; let idx = 0, md = 0;
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / L; if (d > md) { md = d; idx = i; } }
    if (md <= eps) return [a, b];
    return rdp(pts.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(pts.slice(idx), eps));
  }
  // strokes: [[ [x,y], ... ], ...] (CSS px) → {W,H,s:[[x0,y0,dx,dy,...],...]} (0~1000 좌표)
  function encodeStrokes(strokes, w, h) {
    const k = 1000 / Math.max(w, h), out = [];
    strokes.forEach(st => { const p = rdp(st, 0.9); if (!p.length) return; const a = []; let px = 0, py = 0;
      p.forEach(([x, y], i) => { const X = Math.round(x * k), Y = Math.round(y * k); if (i === 0) { a.push(X, Y); } else { a.push(X - px, Y - py); } px = X; py = Y; });
      out.push(a); });
    return { W: Math.round(w * k), H: Math.round(h * k), s: out };
  }
  function decodeStrokes(e) { return e.s.map(a => { const pts = []; let x = 0, y = 0; for (let i = 0; i < a.length; i += 2) { if (i === 0) { x = a[0]; y = a[1]; } else { x += a[i]; y += a[i + 1]; } pts.push([x, y]); } return pts; }); }
  // 획 → 여백 잘라낸 서명 캔버스 (투명 배경)
  function renderStrokes(e, px) {
    px = px || 900; const k = px / Math.max(e.W, e.H), pts = decodeStrokes(e);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    pts.forEach(st => st.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }));
    if (!isFinite(x0)) return null;
    const pad = 14, lw = Math.max(3, px / 170);
    const cv = document.createElement('canvas'); cv.width = Math.ceil((x1 - x0) * k + pad * 2); cv.height = Math.ceil((y1 - y0) * k + pad * 2);
    const c = cv.getContext('2d'); c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = lw; c.strokeStyle = '#111'; c.fillStyle = '#111';
    const T = ([x, y]) => [(x - x0) * k + pad, (y - y0) * k + pad];
    pts.forEach(st => { const p = st.map(T);
      if (p.length === 1) { c.beginPath(); c.arc(p[0][0], p[0][1], lw / 2, 0, 7); c.fill(); return; }
      c.beginPath(); c.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length - 1; i++) { const m = [(p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2]; c.quadraticCurveTo(p[i][0], p[i][1], m[0], m[1]); }
      c.lineTo(p[p.length - 1][0], p[p.length - 1][1]); c.stroke(); });
    return cv;
  }
  // 앱이 임시보관하는 청구 내용 암호화 (열쇠는 서명 요청 링크에만 실려 왔다 돌아온다)
  const rnd = n => crypto.getRandomValues(new Uint8Array(n));
  async function seal(obj) {
    const k = rnd(16), iv = rnd(12), key = await crypto.subtle.importKey('raw', k, 'AES-GCM', false, ['encrypt']);
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, te.encode(JSON.stringify(obj)));
    return { k: b64u(k), iv: b64u(iv), ct: b64u(new Uint8Array(ct)) };
  }
  async function unseal(box, k) {
    const key = await crypto.subtle.importKey('raw', unb64u(k), 'AES-GCM', false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64u(box.iv) }, key, unb64u(box.ct));
    return JSON.parse(td.decode(pt));
  }
  const rid = () => b64u(rnd(9));
  window.SigCodec = { pack, unpack, sha, encodeStrokes, renderStrokes, seal, unseal, rid };
})();
