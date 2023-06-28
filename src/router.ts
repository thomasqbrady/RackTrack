// docs for router https://github.com/thepassle/app-tools/blob/master/router/README.md

import { html } from 'lit';

if (!(globalThis as any).URLPattern) {
  await import("urlpattern-polyfill");
}

import { Router } from '@thepassle/app-tools/router.js';
import { lazy } from '@thepassle/app-tools/router/plugins/lazy.js';

// @ts-ignore
import { title } from '@thepassle/app-tools/router/plugins/title.js';

import './pages/app-home.js';

const baseURL: string = (import.meta as any).env.BASE_URL;

export const router = new Router({
    routes: [
      {
        path:baseURL,
        title: 'Home',
        render: () => html`<app-home></app-home>`
      },
      {
        path: `/settings`,
        title: 'Settings',
        plugins: [
          lazy(() => import('./pages/settings/settings.js')),
        ],
        render: () => html`<app-settings></app-settings>`
      }
    ]
  });
