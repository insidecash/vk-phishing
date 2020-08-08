import { timestamp, files, shell, routes } from "@sapper/service-worker";

import { skipWaiting, clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

const isDevelopment = ["localhost", "127.0.0.1", "ngrok.io"].some(host =>
  location.hostname.includes(host)
);

skipWaiting();
clientsClaim();

if (!isDevelopment) {
  precacheAndRoute([
    // eslint-disable-next-line unicorn/no-null
    ...shell.map(url => ({ url, revision: null })),
    ...files.map(url => ({ url, revision: timestamp }))
  ]);
}

routes.forEach(({ pattern }) =>
  registerRoute(
    pattern,
    new (isDevelopment ? NetworkFirst : StaleWhileRevalidate)({
      cacheName: `app${timestamp}`,
      plugins: [
        new ExpirationPlugin({
          purgeOnQuotaError: true,
          maxEntries: 20,
          maxAgeSeconds: 3600 * 24 * 7
        })
      ]
    })
  )
);
