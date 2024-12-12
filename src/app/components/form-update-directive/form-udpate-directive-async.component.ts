import {AsyncPipe,NgIf} from '@angular/common';
import {AfterViewInit,Component,ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {FormUpdateDirective} from '../../shared/form-update.stream.directive';

@Component({
  selector: 'app-form-update-directive-async',
  standalone: true,
  imports: [FormsModule, FormUpdateDirective, NgIf, AsyncPipe],
  template: `
    <form #myForm="ngForm" appUpdate>
      <input type="text" name="username" ngModel>
      <input type="password" name="password" ngModel>
      <button type="submit">Submit (stream)</button>
    </form>
 
    <!-- Subscribe to appUpdate using the async pipe -->
    <p *ngIf="formUpdates$ | async as formUpdates">
      Welcome, {{ formUpdates.username }} <-- using uppUpdate as Observable and | async
    </p>
  `,
  styles: []
})
export class FormUpdateAsyncComponent implements AfterViewInit {
  // access the appUpdate emitter of the directive applied to the form
  // Give me the instance of FormUpdateDirective applied to the template's <form> element
  @ViewChild(FormUpdateDirective) formUpdateDirective!: FormUpdateDirective;
  formUpdates$!: Observable<any>;

  ngAfterViewInit() {
    // Assign the appUpdate EventEmitter to the observable
    this.formUpdates$ = this.formUpdateDirective.appUpdate.asObservable();
  }
}
