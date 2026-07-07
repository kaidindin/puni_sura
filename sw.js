// キャッシュ名を上げると、古いキャッシュを自動で破棄して新版を配信する
const CACHE='punisura-v2-3';
self.addEventListener('install',e=>{
  self.skipWaiting(); // 新SWを即座に有効化
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // ネット優先。取れたら最新をキャッシュ更新。オフライン時だけキャッシュ。
  e.respondWith(
    fetch(e.request).then(r=>{
      const cl=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cl)); return r;
    }).catch(()=>caches.match(e.request))
  );
});
