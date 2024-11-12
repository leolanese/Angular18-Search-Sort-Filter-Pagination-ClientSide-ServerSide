import {Component,EventEmitter,Output} from '@angular/core';

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
})
export class FilterInputSignalComponent {
  @Output() searchChanged = new EventEmitter<string>();

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchChanged.emit(input.value);
  }
  
}