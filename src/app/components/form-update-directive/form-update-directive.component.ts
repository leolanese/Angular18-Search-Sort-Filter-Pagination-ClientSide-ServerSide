import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FormUpdateDirective} from './../../shared/form-update.directive';

@Component({
  selector: 'app-form-update-directive',
  standalone: true,
  imports: [FormsModule, FormUpdateDirective],
  template: `
    <form #myForm="ngForm" appUpdate (appUpdate)="onFormUpdate($event)">
      <input type="text" name="username" ngModel>
      <input type="password" name="password" ngModel>
      <button type="submit">Submit 1</button>
    </form>
    Welcome, {{ welcomeMessage }} <-- using the directive programmatically
  `,
  styles: []
})
export class FormUpdateComponent {
  welcomeMessage = '';

  onFormUpdate(value: any) {
    console.log('Form value changed:', value);
    if (value.username) {
      // Show a welcome message
      this.welcomeMessage = `Welcome, ${value.username}!`;
    } else {
      // Hide the welcome message
      this.welcomeMessage = '';
    }
  }
}
