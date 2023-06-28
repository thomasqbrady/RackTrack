import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

@customElement('app-workout')
export class AppWorkout extends LitElement {
  @property({ type: Number }) date = 0;
  @property({ type: Array }) exercises: any[] = [];

  static get styles() {
    return css`
        sl-button {
            position: fixed;
            bottom: 16px;
            right: 16px;
        }
        .container {
            padding-bottom: 48px;
        }
    `;
  }

  add() {
    let e = new CustomEvent('add-exercise', {
        detail: this.exercises
    });
    window.dispatchEvent(e);
  }

  firstUpdated() {
  }

  constructor() {
    super();
  }

  render() {
    return html`
        <div class="container">
            ${ this.exercises.map((exercise) =>
                html`<app-exercise
                        .exerciseId=${ exercise.id }
                        .name="${ exercise.name }"
                        .weight="${ exercise.weight }"
                        .reps="${ exercise.reps }"
                        .difficulty="${ exercise.difficulty }"
                        .done="${ exercise.done }"
                    >
                    </app-exercise>`
            )}
            <sl-button @click=${ this.add } circle><span style="font-size: 24px;max-height: 24px;line-height: 24px;">+</span></sl-button>
        </div>
    `;
  }
}
