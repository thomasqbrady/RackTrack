import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import { SlChangeEvent, SlDrawer, SlInput, SlSelect } from '@shoelace-style/shoelace';

@customElement('app-exercise')
export class AppExercise extends LitElement {
  @property({ type: Number }) exerciseId = 0;
  @property({ type: String }) name = "Chest press";
  @property({ type: Number }) weight = 75;
  @property({ type: Number }) reps = 16;
  @property({ type: String }) difficulty = "easy";
  @property({ type: Boolean }) done = false;

  static get styles() {
    return css`
        .exercise {
            display: grid;
            grid-template-columns: 8fr 1fr 1fr 3fr;
            grid-column-gap: 12px;
            margin: 0.5em 0.5em 1em 0.5em;
            padding-bottom: 0.5em;
            border-bottom: 1px solid lightgrey;
        }

        .exercise .center {
            margin: auto;
            line-height: 0.8em;
            font-size: 20px;
        }

        .exercise .unit {
            font-size: 12px;
            font-weight: 500;
            text-align: center;
            width: 100%;
            display:
            inline-block;
        }

        sl-input {
            display: inline-block;
            width: 49%;
            margin-bottom: 16px;
        }
        sl-select {
            margin-bottom: 16px;
        }
        sl-checkbox::part(label) {
            font-weight: 600;
        }
        #name {
            width: 100%;
        }

        .normal {
            font-weight: 500;
        }
        .heavy {
            font-weight: 600;
        }
    `;
  }

  edit() {
    let drawer: HTMLElement | null = this.renderRoot.querySelector('sl-drawer');
    if (drawer) {
        (<any>drawer).show();
    }
  }

  save() {
    let n, w, r, d;
    let nameEl: Element | null | undefined = this.renderRoot.querySelector('#name');
    if (nameEl) {
      n = (<SlInput>nameEl).value;
    } else {
      n = this.name;
    }
    let weightEl: Element | null | undefined = this.renderRoot.querySelector('#weight');
    if (weightEl) {
      w = parseInt((<SlInput>weightEl).value);
    } else {
        w = this.weight;
    }
    let repsEl: Element | null | undefined = this.renderRoot.querySelector('#reps');
    if (repsEl) {
      r = parseInt((<SlInput>repsEl).value);
    } else {
        r = this.reps;
    }
    let difficultyEl: SlSelect | null = this.renderRoot.querySelector('sl-select');
    if (difficultyEl) {
        d = (<string>difficultyEl.value);
    } else {
        d = this.difficulty;
    }

    let drawer: SlDrawer | null = this.renderRoot.querySelector('sl-drawer');
    if (drawer) {
        drawer.hide();
    }
    this.dispatchDataEvent({
        id: this.exerciseId,
        name: n,
        weight: w,
        reps: r,
        difficulty: d,
        done: this.done
    })
  }

  delete() {
    this.dispatchDataEvent({
        id: this.exerciseId,
        delete: true
    })
  }

  dispatchDataEvent(data: any) {
    let e = new CustomEvent('data-change', {
        'detail': data
    })
    window.dispatchEvent(e);
  }

  firstUpdated() {
    let doneEl: SlCheckbox | null = this.renderRoot.querySelector('sl-checkbox');
    if (doneEl) {
        doneEl.addEventListener('sl-change', (ev: SlChangeEvent) => {
            this.dispatchDataEvent({
                id: this.exerciseId,
                name: this.name,
                weight: this.weight,
                reps: this.reps,
                difficulty: this.difficulty,
                done: (<any>ev.target).checked
            });
        });
    }
  }

  constructor() {
    super();
  }

  render() {
    let checkboxEL = html``;
    if (this.done) {
        checkboxEL = html`<div><sl-checkbox style="font-weight: 700;" size="medium" checked>${ this.name }</sl-checkbox></div>`;
    } else {
        checkboxEL = html`<div><sl-checkbox size="medium">${ this.name }</sl-checkbox></div>`;
    }
    return html`
        <sl-drawer label="Edit" placement="top" class="drawer-placement-top">
            <sl-input id="weight" label="Weight" type="number" size="large" .value=${ this.weight } form></sl-input>
            <sl-input id="reps" label="Reps" type="number" size="large" .value=${ this.reps } form></sl-input>
            <sl-select id="difficulty" label="Difficulty" size="medium" value=${ this.difficulty } placement="bottom">
                <sl-option value="easy">easy</sl-option>
                <sl-option value="medium">medium</sl-option>
                <sl-option value="hard">hard</sl-option>
            </sl-select>
            <sl-input id="name" label="Name" size="medium" .value=${ this.name } form></sl-input>
            <sl-button slot="footer" outline variant="danger" @click=${ this.delete }>Delete</sl-button>
            <sl-button slot="footer" variant="primary" @click=${ this.save }>Save</sl-button>
        </sl-drawer>
        <div class="exercise">
            ${ checkboxEL }
            <div class="center heavy" @click=${ this.edit }>${ this.weight }<br><span class="unit">lbs</span></div>
            <div class="center heavy" @click=${ this.edit }>${ this.reps }<br><span class="unit">reps</span></div>
            <div class="center" @click=${ this.edit }>${ this.difficulty }</div>
        </div>
    `;
  }
}
