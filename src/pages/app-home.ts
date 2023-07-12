import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { get, set } from 'idb-keyval';

import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() exercises: any[] = [];
  @property() date: string = '';
  @property() currentWorkoutSaved: boolean = false;

  static get styles() {
    return [
      styles,
      css`
        #settings {
          position: absolute;
          top: 8px;
          right: 8px;
        }
        h1, h2 {
          width: 100%;
          text-align: center;
          margin: 8px 0;
        }
        .timers {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
        }
    `];
  }

  save() {
    let d = new Date().toLocaleDateString();
    set(d, this.exercises);
    this.currentWorkoutSaved = true;
  }

  settings() {
    window.location.href='/settings';
  }

  constructor() {
    super();
    let d = new Date().toLocaleDateString();
    let dOfW = new Date().toLocaleString('en-us', {  weekday: 'long' });
    this.date = `${ dOfW }, ${ d }`;
  }

  sortExercises(a: any, b: any):number {
    if (!a.hasOwnProperty('index')) {
      return 1;
    } else {
      return a.index - b.index
    }
  }

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    window.addEventListener('data-change', (e: any) => {
      let exerciseChanged = (<any>e).detail;
      let exerciseToBeRemoved = this.exercises.find((exercise) => {
        return exercise.id == exerciseChanged.id
      });
      let newExercises: any[] = [];
      if (exerciseChanged.delete) {
        let removalIndex = this.exercises.indexOf(exerciseToBeRemoved);
        newExercises = this.exercises.slice();
        newExercises.splice(removalIndex,1);
      } else {
        this.exercises.forEach((exercise) => {
          if (exercise.id == exerciseChanged.id) {
            for(let prop in exerciseChanged) exercise[prop]=exerciseChanged[prop];
          }
          newExercises.push(exercise);
        });
      }
      this.currentWorkoutSaved = false;
      this.exercises = newExercises.sort(this.sortExercises);
      set('exercises', this.exercises);
    });
    window.addEventListener('add-exercise', () => {
      let newExercises = [...this.exercises].sort(this.sortExercises);
      let newExercise = {
        id: newExercises.length + 1,
        name: 'New',
        weight: 0,
        reps: 0,
        done: false,
        difficulty: 'easy'
      };
      newExercises.push(newExercise);
      this.currentWorkoutSaved = false;
      this.exercises = newExercises.sort(this.sortExercises);
      set('exercises', this.exercises);
    });
    get('exercises').then((exercises) => {
      if (exercises && exercises.length > 0) {
        this.exercises = exercises.sort(this.sortExercises);
      }
    });
    let d = new Date().toLocaleDateString();
    get(d).then((workout) => {
      console.log(workout);
      if (workout && workout.length > 0) {
        this.currentWorkoutSaved = true;
      }
    });


  }

  render() {
    let saveIcon = html``;
    if (this.currentWorkoutSaved) {
      saveIcon = html`<span style="color: green;"><sl-icon name="calendar-heart" label="Save workout" @click=${ this.save }></sl-icon></span>`;
    } else {
      saveIcon = html`<span style="color: red;"><sl-icon name="calendar-heart" label="Save workout" @click=${ this.save }></sl-icon></span>`;
    }
    return html`
      <main>
        <sl-icon id="settings" name="gear" label="Settings" @click=${ this.settings }></sl-icon>
        <h1>Rack Track</h1>
        <div class="timers">
          <app-timer .title="${ 'Timer 1' }" .duration=${ 60 }></app-timer>
          <app-timer .title="${ 'Timer 2' }" .duration=${ 30 }></app-timer>
        </div>
        <h2>${ this.date } ${ saveIcon }</h2>
        <div>
          <app-workout .date="${ new Date().getTime() }" .exercises="${ this.exercises }"></app-workout>
        </div>
      </main>
    `;
  }
}
