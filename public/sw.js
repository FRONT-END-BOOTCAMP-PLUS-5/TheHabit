if (!self.define) {
  let e,
    c = {};
  const s = (s, a) => (
    (s = new URL(s + ".js", a).href),
    c[s] ||
      new Promise((c) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = s), (e.onload = c), document.head.appendChild(e);
        } else (e = s), importScripts(s), c();
      }).then(() => {
        let e = c[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, i) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (c[n]) return;
    let t = {};
    const r = (e) => s(e, n),
      d = { module: { uri: n }, exports: t, require: r };
    c[n] = Promise.all(a.map((e) => d[e] || r(e))).then((e) => (i(...e), t));
  };
}
define(["./workbox-1bb06f5e"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "b9bd028d876a06a520aa354735dd1dc2",
        },
        {
          url: "/_next/static/chunks/4bd1b696-cf72ae8a39fa05aa.js",
          revision: "cf72ae8a39fa05aa",
        },
        {
          url: "/_next/static/chunks/591-54d5df4e45aa03f5.js",
          revision: "54d5df4e45aa03f5",
        },
        {
          url: "/_next/static/chunks/604-50a5476af2e183af.js",
          revision: "50a5476af2e183af",
        },
        {
          url: "/_next/static/chunks/63-e830d34011207317.js",
          revision: "e830d34011207317",
        },
        {
          url: "/_next/static/chunks/834-7d15af6b65407655.js",
          revision: "7d15af6b65407655",
        },
        {
          url: "/_next/static/chunks/860-21a488898cb59c1c.js",
          revision: "21a488898cb59c1c",
        },
        {
          url: "/_next/static/chunks/874-88e24f0e286df0b2.js",
          revision: "88e24f0e286df0b2",
        },
        {
          url: "/_next/static/chunks/964-02efbd2195ef91bd.js",
          revision: "02efbd2195ef91bd",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-d736a901a7280c13.js",
          revision: "d736a901a7280c13",
        },
        {
          url: "/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-5ecc5e5cc74c9afd.js",
          revision: "5ecc5e5cc74c9afd",
        },
        {
          url: "/_next/static/chunks/app/api/challenges/%5Bid%5D/route-5ecc5e5cc74c9afd.js",
          revision: "5ecc5e5cc74c9afd",
        },
        {
          url: "/_next/static/chunks/app/api/challenges/categories/%5BcategoryId%5D/route-5ecc5e5cc74c9afd.js",
          revision: "5ecc5e5cc74c9afd",
        },
        {
          url: "/_next/static/chunks/app/api/challenges/route-5ecc5e5cc74c9afd.js",
          revision: "5ecc5e5cc74c9afd",
        },
        {
          url: "/_next/static/chunks/app/api/routines/%5Bid%5D/complete/route-5ecc5e5cc74c9afd.js",
          revision: "5ecc5e5cc74c9afd",
        },
        {
          url: "/_next/static/chunks/app/api/routines/%5Bid%5D/route-5ecc5e5cc74c9afd.js",
          revision: "5ecc5e5cc74c9afd",
        },
        {
          url: "/_next/static/chunks/app/api/routines/route-5ecc5e5cc74c9afd.js",
          revision: "5ecc5e5cc74c9afd",
        },
        {
          url: "/_next/static/chunks/app/auth/page-5ecc5e5cc74c9afd.js",
          revision: "5ecc5e5cc74c9afd",
        },
        {
          url: "/_next/static/chunks/app/challenges/page-78a8c414920fe854.js",
          revision: "78a8c414920fe854",
        },
        {
          url: "/_next/static/chunks/app/feedback/layout-053d1865b5e63f7d.js",
          revision: "053d1865b5e63f7d",
        },
        {
          url: "/_next/static/chunks/app/feedback/page-5ecc5e5cc74c9afd.js",
          revision: "5ecc5e5cc74c9afd",
        },
        {
          url: "/_next/static/chunks/app/layout-d3c2d5eb10f1094f.js",
          revision: "d3c2d5eb10f1094f",
        },
        {
          url: "/_next/static/chunks/app/login/page-24d639da36660b97.js",
          revision: "24d639da36660b97",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-5ecc5e5cc74c9afd.js",
          revision: "5ecc5e5cc74c9afd",
        },
        {
          url: "/_next/static/chunks/app/page-b11f3ad053c63df0.js",
          revision: "b11f3ad053c63df0",
        },
        {
          url: "/_next/static/chunks/app/signup/page-2dfc912079d0185f.js",
          revision: "2dfc912079d0185f",
        },
        {
          url: "/_next/static/chunks/framework-7c95b8e5103c9e90.js",
          revision: "7c95b8e5103c9e90",
        },
        {
          url: "/_next/static/chunks/main-551d6b5a661005bd.js",
          revision: "551d6b5a661005bd",
        },
        {
          url: "/_next/static/chunks/main-app-1fb19f3713e329c2.js",
          revision: "1fb19f3713e329c2",
        },
        {
          url: "/_next/static/chunks/pages/_app-0a0020ddd67f79cf.js",
          revision: "0a0020ddd67f79cf",
        },
        {
          url: "/_next/static/chunks/pages/_error-03529f2c21436739.js",
          revision: "03529f2c21436739",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-7cc99edc1a50fd44.js",
          revision: "7cc99edc1a50fd44",
        },
        {
          url: "/_next/static/css/44b87cee39355881.css",
          revision: "44b87cee39355881",
        },
        {
          url: "/_next/static/media/activeAlarm.16c8da6a.svg",
          revision: "79526cfe86bba0fa0d9119dbf926e2f6",
        },
        {
          url: "/_next/static/media/activeHome.e53b8999.svg",
          revision: "a2f1ac57a85f6472d839f93cd4c07b3c",
        },
        {
          url: "/_next/static/media/activeSearch.a71d3cf3.svg",
          revision: "e694370fe0841cebf8faaf4d56b2e373",
        },
        {
          url: "/_next/static/media/activeSetting.eaf443de.svg",
          revision: "77fa693549317673adacde560b9ddbfa",
        },
        {
          url: "/_next/static/media/alarm.1749cafc.svg",
          revision: "4e2d6ede69fe80c48b569244bc958cc8",
        },
        {
          url: "/_next/static/media/ff840cfebfb63b0c-s.p.woff2",
          revision: "302ec55f5b4320354ec6b35a53dead87",
        },
        {
          url: "/_next/static/media/home.3f903dc9.svg",
          revision: "bdc12cdc274ff502ab08060d76f5e9a5",
        },
        {
          url: "/_next/static/media/search.cfc9c45c.svg",
          revision: "5a70272a0dd9ee210f8218b6eb4a3260",
        },
        {
          url: "/_next/static/media/setting.0e99e169.svg",
          revision: "118749a041bb16e7da0b8894473e93d7",
        },
        {
          url: "/_next/static/media/tabButton.e3e5e1f4.svg",
          revision: "25ddf7a2240e33bf979c819aebd4fed4",
        },
        {
          url: "/_next/static/vghpCVtSP4OdVZ56qbp0Q/_buildManifest.js",
          revision: "46a5353b92bb2c6e909f98bf00e1f182",
        },
        {
          url: "/_next/static/vghpCVtSP4OdVZ56qbp0Q/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/consts/checkBoxItem.ts",
          revision: "610323d99244adba3f366575f75db457",
        },
        {
          url: "/consts/loginItem.ts",
          revision: "043df435fc567639d79f651047228e40",
        },
        {
          url: "/consts/signupItem.ts",
          revision: "65a01e9b6675f16e40f9cbea5c5e4f6f",
        },
        {
          url: "/consts/tabItem.ts",
          revision: "f5df6d4784d1e1753a7ecf56960965c2",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/fileEdit.png", revision: "bc3edd33265e5e6949625ded9cb594bd" },
        {
          url: "/fonts/PretendardVariable.woff2",
          revision: "302ec55f5b4320354ec6b35a53dead87",
        },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        {
          url: "/icons/activeAlarm.svg",
          revision: "79526cfe86bba0fa0d9119dbf926e2f6",
        },
        {
          url: "/icons/activeHome.svg",
          revision: "a2f1ac57a85f6472d839f93cd4c07b3c",
        },
        {
          url: "/icons/activeSearch.svg",
          revision: "e694370fe0841cebf8faaf4d56b2e373",
        },
        {
          url: "/icons/activeSetting.svg",
          revision: "77fa693549317673adacde560b9ddbfa",
        },
        {
          url: "/icons/alarm.svg",
          revision: "4e2d6ede69fe80c48b569244bc958cc8",
        },
        {
          url: "/icons/apple-touch-icon.png",
          revision: "49efa5daaeadffa2a48f7aa3f459801c",
        },
        {
          url: "/icons/back.svg",
          revision: "29b11da043327ac4a8aaa9d0ae04a2d4",
        },
        {
          url: "/icons/camera.svg",
          revision: "48fa8ffc63a8dc9e4cab683c266f543a",
        },
        {
          url: "/icons/google.svg",
          revision: "8396e5554877801ab4538f81f64526af",
        },
        {
          url: "/icons/home.svg",
          revision: "bdc12cdc274ff502ab08060d76f5e9a5",
        },
        {
          url: "/icons/kakao.svg",
          revision: "602cd55085ee47647b68bec354a91c71",
        },
        {
          url: "/icons/manifest-192x192.png",
          revision: "3d791d634748ce4e0822db92604df67e",
        },
        {
          url: "/icons/manifest-512x512.png",
          revision: "7cdcfbdfdda69c0c34228662b1da7d30",
        },
        {
          url: "/icons/search.svg",
          revision: "5a70272a0dd9ee210f8218b6eb4a3260",
        },
        {
          url: "/icons/setting.svg",
          revision: "118749a041bb16e7da0b8894473e93d7",
        },
        {
          url: "/icons/tabButton.svg",
          revision: "25ddf7a2240e33bf979c819aebd4fed4",
        },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        {
          url: "/utils/axiosInstance.ts",
          revision: "530ddc40f41b5baf0b5ed890fc301f78",
        },
        {
          url: "/utils/prismaClient.ts",
          revision: "ab281ef48ce2e730525e4eb5c9e1c601",
        },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: c,
              event: s,
              state: a,
            }) =>
              c && "opaqueredirect" === c.type
                ? new Response(c.body, {
                    status: 200,
                    statusText: "OK",
                    headers: c.headers,
                  })
                : c,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const c = e.pathname;
        return !c.startsWith("/api/auth/") && !!c.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
