/* 청구서앱 서비스워커 — 앱 파일을 폰에 저장해 두고 인터넷이 없어도 열리게 한다.
   고객 입력값·서명·첨부는 여기서 다루지 않는다(화면 메모리에만 있음). */
const VER = 'claim-v1-20261029';
const CORE = [
  './', './index.html', './manifest.webmanifest',
  './forms/samsung-fire.js', './vendor/pdf-lib.min.js', './vendor/html2canvas.min.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('claim-v') && k !== VER).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    if (url.pathname.includes('/api/')) return;              // 맥미니 서버로 열었을 때의 API는 그대로 통과
    if (req.mode === 'navigate') {                           // 앱 화면: 온라인이면 최신, 오프라인이면 저장본
      e.respondWith(
        fetch(req).then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(VER).then(c => c.put('./index.html', copy)); }
          return res;
        }).catch(() => caches.match('./index.html'))
      );
      return;
    }
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VER).then(c => c.put(req, copy)); }
        return res;
      }))
    );
    return;
  }

  if (/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {   // 글꼴은 한 번 받으면 재사용
    e.respondWith(
      caches.open('claim-fonts').then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') c.put(req, res.clone());
        return res;
      })))
    );
  }
});
