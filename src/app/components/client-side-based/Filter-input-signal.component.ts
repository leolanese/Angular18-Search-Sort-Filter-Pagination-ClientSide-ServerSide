import {ChangeDetectionStrategy,Component,Input,signal} from '@angular/core';

@Component({
  selector: 'app-filter-input-signal',
  standalone: true,
  template: `
    <input
      type="text"
      (keyup)="onSearch($event)"
      placeholder="Type to search..."
    />
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FilterInputSignalComponent {
  // Define a Signal Input to update the parent signal
  @Input() searchSignal = signal('');

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSignal.set(value);  // Update the signal value from the parent service
  }

}
