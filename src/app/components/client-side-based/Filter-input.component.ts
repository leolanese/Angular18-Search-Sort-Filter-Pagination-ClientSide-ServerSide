import {Component,Input} from '@angular/core';
import {FormControl,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-filter-input',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <input
      [formControl]="filterControl"
      class="form-control"
      type="text"
      placeholder="Filter Name (Patricia, Kurtis, etc)..."
    />
  `
})
export class FilterInputComponent {
  @Input() filterControl!: FormControl; // Input to receive the FormControl from the parent component
}
