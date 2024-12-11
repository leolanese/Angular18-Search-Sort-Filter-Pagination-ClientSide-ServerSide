import {Directive,EventEmitter,Output,inject} from '@angular/core';
import {NgForm} from '@angular/forms';

// emits form value changes when the NgForm's valueChanges observable emits values.
@Directive({ selector: 'form[appUpdate]', standalone: true })
export class FormUpdateDirective {
  private ngForm = inject(NgForm);

  @Output()
  appUpdate = new EventEmitter();

  constructor() {
    this.ngForm.valueChanges?.subscribe((value) => {
      console.log('Form value changed:', value); // Add this log
      this.appUpdate.emit(value);
    });
  }
}