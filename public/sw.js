<<<<<<< HEAD
if (!self.define) {
  let e,
    a = {};
  const s = (s, i) => (
    (s = new URL(s + ".js", i).href),
    a[s] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = s), (e.onload = a), document.head.appendChild(e);
        } else (e = s), importScripts(s), a();
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, c) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (a[n]) return;
    let t = {};
    const r = (e) => s(e, n),
      d = { module: { uri: n }, exports: t, require: r };
    a[n] = Promise.all(i.map((e) => d[e] || r(e))).then((e) => (c(...e), t));
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
          revision: "b92ad5438aa2d7bd8919bddb7dfe2fcb",
        },
        {
          url: "/_next/static/aK2sdB5yOpCK8aIHn3RBb/_buildManifest.js",
          revision: "1a0313715257e70a9f58554ae09b27c7",
        },
        {
          url: "/_next/static/aK2sdB5yOpCK8aIHn3RBb/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/110-548655337344a43b.js",
          revision: "548655337344a43b",
        },
        {
          url: "/_next/static/chunks/259-143dd27813b1318c.js",
          revision: "143dd27813b1318c",
        },
        {
          url: "/_next/static/chunks/308-6a751258eae2fc42.js",
          revision: "6a751258eae2fc42",
        },
        {
          url: "/_next/static/chunks/454-40464c351c32d338.js",
          revision: "40464c351c32d338",
        },
        {
          url: "/_next/static/chunks/4bd1b696-cf72ae8a39fa05aa.js",
          revision: "cf72ae8a39fa05aa",
        },
        {
          url: "/_next/static/chunks/63-e830d34011207317.js",
          revision: "e830d34011207317",
        },
        {
          url: "/_next/static/chunks/964-02efbd2195ef91bd.js",
          revision: "02efbd2195ef91bd",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-287bc6139b707b6c.js",
          revision: "287bc6139b707b6c",
        },
        {
          url: "/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-1a8651ddb92cce0f.js",
          revision: "1a8651ddb92cce0f",
        },
        {
          url: "/_next/static/chunks/app/auth/page-529e9e2b713ce4af.js",
          revision: "529e9e2b713ce4af",
        },
        {
          url: "/_next/static/chunks/app/feedback/layout-9626632ab8a62adf.js",
          revision: "9626632ab8a62adf",
        },
        {
          url: "/_next/static/chunks/app/feedback/page-1a8651ddb92cce0f.js",
          revision: "1a8651ddb92cce0f",
        },
        {
          url: "/_next/static/chunks/app/layout-b4ca87e862b32d6a.js",
          revision: "b4ca87e862b32d6a",
        },
        {
          url: "/_next/static/chunks/app/manifest.webmanifest/route-1a8651ddb92cce0f.js",
          revision: "1a8651ddb92cce0f",
        },
        {
          url: "/_next/static/chunks/app/page-40351268fcfa199b.js",
          revision: "40351268fcfa199b",
        },
        {
          url: "/_next/static/chunks/app/signup/page-73b8e2e3566ae5da.js",
          revision: "73b8e2e3566ae5da",
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
          url: "/_next/static/chunks/main-app-685e6baf8063efc4.js",
          revision: "685e6baf8063efc4",
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
          url: "/_next/static/css/7aaafabce1265e2d.css",
          revision: "7aaafabce1265e2d",
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
          url: "/consts/tabItem.ts",
          revision: "f5df6d4784d1e1753a7ecf56960965c2",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
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
          url: "/icons/home.svg",
          revision: "bdc12cdc274ff502ab08060d76f5e9a5",
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
          revision: "08c107b71a32996c5e2c4bab396f2324",
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
              response: a,
              event: s,
              state: i,
            }) =>
              a && "opaqueredirect" === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: "OK",
                    headers: a.headers,
                  })
                : a,
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
        const a = e.pathname;
        return !a.startsWith("/api/auth/") && !!a.startsWith("/api/");
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
=======
if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise(s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()}).then(()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e}));self.define=(n,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>a(e,t),o={module:{uri:t},exports:c,require:r};s[t]=Promise.all(n.map(e=>o[e]||r(e))).then(e=>(i(...e),c))}}define(["./workbox-4754cb34"],function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"cac54c808a97a71c185058a52c74023e"},{url:"/_next/static/6pEaSotruv16i3sPpkP6r/_buildManifest.js",revision:"05e505a10f496893defc0a8a6e96c913"},{url:"/_next/static/6pEaSotruv16i3sPpkP6r/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/341.716d46e6e5cb6bdc.js",revision:"716d46e6e5cb6bdc"},{url:"/_next/static/chunks/472.a3826d29d6854395.js",revision:"a3826d29d6854395"},{url:"/_next/static/chunks/4bd1b696-cf72ae8a39fa05aa.js",revision:"cf72ae8a39fa05aa"},{url:"/_next/static/chunks/63-e830d34011207317.js",revision:"e830d34011207317"},{url:"/_next/static/chunks/964-02efbd2195ef91bd.js",revision:"02efbd2195ef91bd"},{url:"/_next/static/chunks/app/_not-found/page-3bf5970a2eec24c3.js",revision:"3bf5970a2eec24c3"},{url:"/_next/static/chunks/app/layout-66b7b591f8deb2c6.js",revision:"66b7b591f8deb2c6"},{url:"/_next/static/chunks/app/manifest.webmanifest/route-cffb523967d31e6a.js",revision:"cffb523967d31e6a"},{url:"/_next/static/chunks/app/page-9aa693106ee6b0e0.js",revision:"9aa693106ee6b0e0"},{url:"/_next/static/chunks/framework-7c95b8e5103c9e90.js",revision:"7c95b8e5103c9e90"},{url:"/_next/static/chunks/main-6ee7f5ee57d5d8ca.js",revision:"6ee7f5ee57d5d8ca"},{url:"/_next/static/chunks/main-app-058247194275c0cf.js",revision:"058247194275c0cf"},{url:"/_next/static/chunks/pages/_app-663ec5428c344dae.js",revision:"663ec5428c344dae"},{url:"/_next/static/chunks/pages/_error-544778206352ce59.js",revision:"544778206352ce59"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-d6b6b34f2743ffdb.js",revision:"d6b6b34f2743ffdb"},{url:"/_next/static/css/12a349dbb429a96b.css",revision:"12a349dbb429a96b"},{url:"/_next/static/media/ff840cfebfb63b0c-s.p.woff2",revision:"302ec55f5b4320354ec6b35a53dead87"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/fonts/PretendardVariable.woff2",revision:"302ec55f5b4320354ec6b35a53dead87"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/images/icons/apple-touch-icon.png",revision:"49efa5daaeadffa2a48f7aa3f459801c"},{url:"/images/icons/manifest-192x192.png",revision:"3d791d634748ce4e0822db92604df67e"},{url:"/images/icons/manifest-512x512.png",revision:"7cdcfbdfdda69c0c34228662b1da7d30"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")},new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")},new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(({url:e})=>!(self.origin===e.origin),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")});
>>>>>>> f888bfb8236f1c2098e84191f27da56b97c98323
