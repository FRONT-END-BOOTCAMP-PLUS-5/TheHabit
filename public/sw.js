if (!self.define) {
  let e,
    s = {};
  const a = (a, c) => (
    (a = new URL(a + '.js', c).href),
    s[a] ||
      new Promise(s => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = a), (e.onload = s), document.head.appendChild(e));
        } else ((e = a), importScripts(a), s());
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, i) => {
    const n = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[n]) return;
    let t = {};
    const f = e => a(e, n),
      r = { module: { uri: n }, exports: t, require: f };
    s[n] = Promise.all(c.map(e => r[e] || f(e))).then(e => (i(...e), t));
  };
}
define(['./workbox-1bb06f5e'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: 'b302d47250dddf53eb0502727f1fbc26' },
        {
          url: '/_next/static/_SrHFLPwL1Ddubpmm062L/_buildManifest.js',
          revision: '6f92cb8055413558aa77b87297b7346d',
        },
        {
          url: '/_next/static/_SrHFLPwL1Ddubpmm062L/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/397-2eecd583d990275f.js', revision: '2eecd583d990275f' },
        { url: '/_next/static/chunks/4bd1b696-cf72ae8a39fa05aa.js', revision: 'cf72ae8a39fa05aa' },
        { url: '/_next/static/chunks/591-54d5df4e45aa03f5.js', revision: '54d5df4e45aa03f5' },
        { url: '/_next/static/chunks/63-e830d34011207317.js', revision: 'e830d34011207317' },
        { url: '/_next/static/chunks/860-21a488898cb59c1c.js', revision: '21a488898cb59c1c' },
        { url: '/_next/static/chunks/964-02efbd2195ef91bd.js', revision: '02efbd2195ef91bd' },
        {
          url: '/_next/static/chunks/app/_not-found/page-085a38e7785278af.js',
          revision: '085a38e7785278af',
        },
        {
          url: '/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/api/challenges/%5Bid%5D/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/api/challenges/categories/%5BcategoryId%5D/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/api/challenges/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/api/feedback/%5Bid%5D/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/api/feedback/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/api/gpt/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/api/routines/%5Bid%5D/complete/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/api/routines/%5Bid%5D/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/api/routines/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/challenges/page-055655fd481ed994.js',
          revision: '055655fd481ed994',
        },
        {
          url: '/_next/static/chunks/app/feedback/%5Bid%5D/page-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/feedback/layout-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/feedback/page-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        {
          url: '/_next/static/chunks/app/layout-502ebb989355e6fb.js',
          revision: '502ebb989355e6fb',
        },
        {
          url: '/_next/static/chunks/app/login/page-1c9dbc2901bb7ed1.js',
          revision: '1c9dbc2901bb7ed1',
        },
        {
          url: '/_next/static/chunks/app/manifest.webmanifest/route-0a6c42cf5d2f77f8.js',
          revision: '0a6c42cf5d2f77f8',
        },
        { url: '/_next/static/chunks/app/page-704c2057c12a910b.js', revision: '704c2057c12a910b' },
        {
          url: '/_next/static/chunks/app/signup/page-e0bf1da9825949f5.js',
          revision: 'e0bf1da9825949f5',
        },
        { url: '/_next/static/chunks/framework-7c95b8e5103c9e90.js', revision: '7c95b8e5103c9e90' },
        { url: '/_next/static/chunks/main-291fea4d706e0fbc.js', revision: '291fea4d706e0fbc' },
        { url: '/_next/static/chunks/main-app-26865f1512d55fdc.js', revision: '26865f1512d55fdc' },
        {
          url: '/_next/static/chunks/pages/_app-0a0020ddd67f79cf.js',
          revision: '0a0020ddd67f79cf',
        },
        {
          url: '/_next/static/chunks/pages/_error-03529f2c21436739.js',
          revision: '03529f2c21436739',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        { url: '/_next/static/chunks/webpack-7cc99edc1a50fd44.js', revision: '7cc99edc1a50fd44' },
        { url: '/_next/static/css/734daa40c7a85b2f.css', revision: '734daa40c7a85b2f' },
        {
          url: '/_next/static/media/ff840cfebfb63b0c-s.p.woff2',
          revision: '302ec55f5b4320354ec6b35a53dead87',
        },
        { url: '/consts/checkBoxItem.ts', revision: '610323d99244adba3f366575f75db457' },
        { url: '/consts/gptPrompt.ts', revision: 'b6f4a144ed39a59c2565fecd1bb7a6f2' },
        { url: '/consts/loginItem.ts', revision: '043df435fc567639d79f651047228e40' },
        { url: '/consts/loginItme.ts', revision: 'c747de28595bd7d457b4468c5f2f50ea' },
        { url: '/consts/signupItem.ts', revision: '65a01e9b6675f16e40f9cbea5c5e4f6f' },
        { url: '/consts/tabItem.ts', revision: 'f5df6d4784d1e1753a7ecf56960965c2' },
        { url: '/file.svg', revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71' },
        { url: '/fileEdit.png', revision: 'bc3edd33265e5e6949625ded9cb594bd' },
        { url: '/fonts/PretendardVariable.woff2', revision: '302ec55f5b4320354ec6b35a53dead87' },
        { url: '/globe.svg', revision: '2aaafa6a49b6563925fe440891e32717' },
        { url: '/icons/activeAlarm.svg', revision: '79526cfe86bba0fa0d9119dbf926e2f6' },
        { url: '/icons/activeHome.svg', revision: 'a2f1ac57a85f6472d839f93cd4c07b3c' },
        { url: '/icons/activeSearch.svg', revision: 'e694370fe0841cebf8faaf4d56b2e373' },
        { url: '/icons/activeSetting.svg', revision: '77fa693549317673adacde560b9ddbfa' },
        { url: '/icons/alarm.svg', revision: '4e2d6ede69fe80c48b569244bc958cc8' },
        { url: '/icons/apple-touch-icon.png', revision: '49efa5daaeadffa2a48f7aa3f459801c' },
        { url: '/icons/back.svg', revision: '29b11da043327ac4a8aaa9d0ae04a2d4' },
        { url: '/icons/camera.svg', revision: '48fa8ffc63a8dc9e4cab683c266f543a' },
        { url: '/icons/fileUpload.svg', revision: '8d0935aa7a7281d820c92ca992d3c219' },
        { url: '/icons/google.svg', revision: '8396e5554877801ab4538f81f64526af' },
        { url: '/icons/googleIcon.svg', revision: '8396e5554877801ab4538f81f64526af' },
        { url: '/icons/home.svg', revision: 'bdc12cdc274ff502ab08060d76f5e9a5' },
        { url: '/icons/kakao.svg', revision: 'f4accb6301cbbd7759ce58be59ecb06f' },
        { url: '/icons/manifest-192x192.png', revision: '3d791d634748ce4e0822db92604df67e' },
        { url: '/icons/manifest-512x512.png', revision: '7cdcfbdfdda69c0c34228662b1da7d30' },
        { url: '/icons/noShowPassword.svg', revision: '03455afd264f6dab3efc2783012a7631' },
        { url: '/icons/search.svg', revision: '5a70272a0dd9ee210f8218b6eb4a3260' },
        { url: '/icons/setting.svg', revision: '118749a041bb16e7da0b8894473e93d7' },
        { url: '/icons/showPassword.svg', revision: 'ac7e67cfb670561985adde1beedebca8' },
        { url: '/icons/tabButton.svg', revision: '25ddf7a2240e33bf979c819aebd4fed4' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        { url: '/utils/axiosInstance.ts', revision: '0f7db666e3a9ea7d5885007086c6d20b' },
        { url: '/utils/prismaClient.ts', revision: 'ab281ef48ce2e730525e4eb5c9e1c601' },
        { url: '/vercel.svg', revision: 'c0af2f507b369b085b35ef4bbe3bcf1e' },
        { url: '/window.svg', revision: 'a2760511c65806022ad20adf74370ff3' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: a, state: c }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET'
    ));
});
