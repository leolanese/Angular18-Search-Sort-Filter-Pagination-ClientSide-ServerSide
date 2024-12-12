import {Directive,inject} from '@angular/core';
import {NgForm} from '@angular/forms';
import {FormUpdateSignalService} from './form-update.signal.service';

@Directive({ selector: 'form[appUpdate]',  standalone: true })
export class FormUpdateSignalDirective {
  private ngForm = inject(NgForm);
  private formUpdateSignalService = inject(FormUpdateSignalService);

  constructor() {
    console.log('DIRECTIVE: FormUpdateSignalDirective instantiated');
    console.log('DIRECTIVE: NgForm instance:', this.ngForm);

    this.ngForm.valueChanges?.subscribe((value) => {
      console.log('DIRECTIVE: Form value changed:', value);

      // do not emmit, instead set the service signal
      // this.appUpdate.emit(value);
      this.formUpdateSignalService.updateFormState(value);
    });
  }
}
