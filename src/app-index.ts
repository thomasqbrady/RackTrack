import { LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import './pages/app-home';
import './components/timer';
import './components/exercise';
import './components/header';
import './components/workout';
import './styles/global.css';
import { router } from './router';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

@customElement('app-index')
export class AppIndex extends LitElement {
  static get styles() {
    return css`
      main {
        padding-left: 16px;
        padding-right: 16px;
        padding-bottom: 16px;
      }
    `;
  }

  constructor() {
    super();
    setBasePath('/node_modules/@shoelace-style/shoelace/dist');
  }

  firstUpdated() {
    router.addEventListener('route-changed', () => {
      if ("startViewTransition" in document) {
        return (document as any).startViewTransition(() => {
          this.requestUpdate();
        });
      }
      else {
        this.requestUpdate();
      }
    });
  }

  render() {
    // router config can be round in src/router.ts
    return router.render();
  }
}
