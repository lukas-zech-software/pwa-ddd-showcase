"use strict";

module.exports = [
  {
    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
    handler:    "CacheFirst",
    options:    {
      cacheName:  "google-fonts",
      expiration: {
        maxEntries:    4,
        maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
      }
    }
  },
  {
    urlPattern: /^https:\/\/maps\.googleapis\.com\/.*api\/js.*/,
    handler:    "CacheFirst",
    options:    {
      cacheableResponse: {
        statuses: [0, 200]
      },
      cacheName:         "google-maps-api",
      expiration:        {
        maxEntries:    4,
        maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
      }
    }
  },
  {
    urlPattern: /^https:\/\/maps\.googleapis\.com\/maps\/vt.*/i,
    handler:    "CacheFirst",
    options:    {
      cacheableResponse: {
        statuses: [0, 200]
      },
      cacheName:         "google-maps-vt",
      expiration:        {
        maxEntries:    4,
        maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
      }
    }
  },
  {
    urlPattern: /^https:\/\/storage\.googleapis\.com\/(?:images|static)\.my-old-startups-domain\.de\/.*/i,
    handler:    "StaleWhileRevalidate",
    options:    {
      cacheableResponse: {
        statuses: [0, 200]
      },
      cacheName:         "google-cdn",
      expiration:        {
        maxEntries:    4,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 365 days
      }
    }
  },
  {
    urlPattern:/^https:\/\/(?:app|test-app)\.my-old-startups-domain\.de\/.*/i,
    handler:    "StaleWhileRevalidate",
    options:    {
      cacheName:  "http-cache",
      expiration: {
        maxEntries:    16,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      }
    }
  }
];
