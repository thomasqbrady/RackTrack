import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { clear, set, entries } from 'idb-keyval';

// You can also import styles from another file
// if you prefer to keep your CSS seperate from your component
import { styles } from './settings-styles';

import { styles as sharedStyles } from '../../styles/shared-styles'

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';

@customElement('app-settings')
export class AppSettings extends LitElement {
  @property() workouts: string = '';

  static styles = [
    sharedStyles,
    styles
  ]

  constructor() {
    super();
  }

  copy() {
    let alert = this.renderRoot.querySelector('sl-alert');
    alert?.show();
    const type = "text/plain";
    const blob = new Blob([this.workouts], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data);
  }

  import() {
    let ta: HTMLTextAreaElement | null = this.renderRoot.querySelector('#import');
    if (ta?.value) {
      let newData = JSON.parse(ta?.value);
      newData.forEach((entry) => {
        set(entry[0], entry[1]);
      });
    }
  }

  clear() {
    clear();
  }

  firstUpdated() {
    entries().then((entries) => {
      this.workouts = JSON.stringify(entries);
    });
  }

  render() {
    return html`
      <app-header ?enableBack="${true}"></app-header>

      <main>
        <h2>Settings</h2>

        <sl-card>
          <div class="alert-duration">
            <span class="data-tool-icon"><sl-icon name="clipboard-plus" label="copy to clipboard" @click=${ this.copy }></sl-icon></span>

            <sl-alert variant="success" duration="3000" closable>
              <sl-icon slot="icon" name="check2-circle"></sl-icon>
              Copied!
            </sl-alert>
          </div>

          <h2>Export:</h2>

          <textarea>
              ${ this.workouts }
          </textarea>
        </sl-card>

        <sl-card>
          <h2>Import:</h2>
          <span class="data-tool-icon"><sl-icon name="cloud-arrow-up" @click=${ this.import }></sl-icon></span>

          <textarea id="import"></textarea>
        </sl-card>

        <sl-button @click=${ this.clear }>Clear</sl-button>
  </main>
    `;
  }
}
