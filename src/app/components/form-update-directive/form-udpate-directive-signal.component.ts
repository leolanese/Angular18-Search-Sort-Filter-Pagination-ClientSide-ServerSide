import {FormUpdateSignalService} from '@/shared/form-update.signal.service';
import {NgIf} from '@angular/common';
import {AfterViewInit,ChangeDetectionStrategy,Component,inject,ViewChild} from '@angular/core';
import {FormsModule,NgForm} from '@angular/forms';
import {FormUpdateSignalDirective} from '../../shared/form-udpate.signal.directive';

// Example Flow
// A user types into the form fields.
// NgForm.valueChanges emits the updated form value.
// The directive updates the Signal in the service with the new form state.
// The component automatically reacts to changes in the Signal and updates the view.

@Component({
  selector: 'app-form-update-directive-signal',
  standalone: true,
  imports: [FormsModule, NgIf, FormUpdateSignalDirective],
  providers: [FormUpdateSignalService, NgForm],
  template: `
    <form #myForm="ngForm" appUpdate>
      <input type="text" name="username" ngModel>
      <input type="password" name="password" ngModel>
      <button type="submit">Submit (signal)</button>
    </form>
    
    <p *ngIf="formUpdatesSignal()">
      Welcome, {{ formUpdatesSignal().username }}!
    </p>
  `,
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUpdateSignalComponent implements AfterViewInit {
  private formUpdateSignalService = inject(FormUpdateSignalService);
  @ViewChild('myForm', { static: true }) myForm!: NgForm;

  ngAfterViewInit() {
    this.myForm.valueChanges?.subscribe((value) => {
      console.log('COMPONENT: Form value changed:', value);
    });
  }

  formUpdatesSignal = this.formUpdateSignalService.formState;

}
