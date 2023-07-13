import { LitElement, css, html } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

@customElement('app-timer')
export class AppTimer extends LitElement {
  @property({ type: String }) title = "";
  @property({ type: Number }) duration = 0;
  @property({ type: Number }) startTime = 0;
  @property({ type: Number }) remainingTime = this.duration;
  @property({ type: Number }) elapsedTime = 0;
  @property({ type: Boolean }) paused = false;
  @property({ type: Boolean }) running = false;
  @property({ type: Boolean }) editing = false;
  @property({ type: Number }) timer = 0;

  @state() protected _ding = new Audio('assets/ding.mp3');
  @state() protected _finished = false;

  static get styles() {
    return css`
        .timer {
            margin: 0 16px 16px 16px;
        }
        .timer.finished {
            background-color: pink;
        }
        .timer-name {
            width: 100%;
            text-align: center;
        }
        .timer-display {
            text-align: center;
            font-size: var(--sl-font-size-4x-large);
        }
        sl-button-group {
            margin: auto;
        }
        sl-input {
            display: block;
            width: 8em;
        }
    `;
  }

  start() {
    this._ding.play();
    this._ding.pause();
    let ns: any = (<any>window).ns;
    ns.enable();
    this.startTime = new Date().getTime();
    this.running = true;
    this.paused = false;
    this.timer = setInterval(() => {
        if (!this.paused) {
            let currentTime = new Date().getTime();
            let remains = this.duration - (this.elapsedTime + Math.floor((currentTime - this.startTime)/1000));
            if (remains <= 0) {
              if (!this._finished) {
                this.renderRoot.querySelector(".timer")?.classList.add('finished');
                this.remainingTime = 0;
                this._ding.play();
                this._finished = true;
              }
            } else {
              this.remainingTime = remains;
            }
          }
    }, 100);
  }

  pause() {
    this.paused = true;
    let currentTime = new Date().getTime();
    this.elapsedTime += Math.floor((currentTime - this.startTime)/1000);
}

  resume() {
    this.paused = false;
    this.startTime = new Date().getTime();
  }

  reset() {
    let ns: any = (<any>window).ns;
    ns.disable();
    this.renderRoot.querySelector(".timer")?.classList.remove('finished');
    clearInterval(this.timer);
    this.paused = this.running = false;
    this.elapsedTime = 0;
    this.remainingTime = this.duration;
    this._finished = false;
  }

  edit() {
    this.editing = true;
  }

  save() {
      let inputEl: HTMLInputElement | null | undefined = this.shadowRoot?.querySelector('#duration')?.shadowRoot?.querySelector('#input');
      if (inputEl) {
        this.duration = parseInt(inputEl.value, 10);
      }
      this.editing = false;
  }

  constructor() {
    super();
    this.remainingTime = this.duration;
  }

  render() {
    let timeToShow = '';
    let primaryButton = html``;
    if (!this.running) {
        timeToShow += this.duration;
        primaryButton = html`<sl-button size="medium" outline variant="success" @click="${ this.start }">Start</sl-button>`;
    } else {
        timeToShow += this.remainingTime;
        if (this.paused) {
            primaryButton = html`<sl-button size="medium" outline variant="primary" @click="${ this.resume }">Resume</sl-button>`;
        } else {
            if (this.remainingTime > 0) {
                primaryButton = html`<sl-button size="medium" outline variant="primary" @click="${ this.pause }">Pause</sl-button>`;
            }
        }
    }
    let timerDisplay = html``;
    let buttonGroup = html``;
    if (this.editing) {
        timerDisplay = html`<sl-input id="duration" type="number" size="large" .value=${ this.duration } form></sl-input>
        <sl-button size="medium" @click=${ this.save }>SAVE</sl-button>
        `;
    } else {
        timerDisplay = html`<div class="timer-display" @click=${ this.edit }>${ timeToShow }</div>`;
        buttonGroup = html`        <sl-button-group>
            <sl-button size="medium" outline variant="danger" @click="${ this.reset }">Reset</sl-button>
                ${ primaryButton }
            </sl-button-group>
        `;
    }
    return html`
      <div class="timer">
        <div class="timer-name">${ this.title }</div>
        ${ timerDisplay }
        ${ buttonGroup }
      </div>
    `;
  }
}
