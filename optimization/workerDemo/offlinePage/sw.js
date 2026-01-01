// 缓存名称和核心资源
const CACHE_NAME = 'blog-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html',
  '/images/logo.png'
];

// 安装阶段：缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting()) // 跳过等待，立即激活
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim()) // 接管所有页面
  );
});

// 拦截请求：实现离线策略
self.addEventListener('fetch', (event) => {
  // 页面导航请求（HTML页面）
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 缓存新访问的文章页面
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
          });
          return response;
        })
        .catch(() => {
          // 离线时返回缓存页面或离线提示页
          return caches.match(event.request) || caches.match('/offline.html');
        })
    );
  } 
  // 静态资源请求（CSS/JS/图片）
  else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});