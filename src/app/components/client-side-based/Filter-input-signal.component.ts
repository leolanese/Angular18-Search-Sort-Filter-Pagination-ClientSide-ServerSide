import {SearchService} from '@/services/client.side.based.pagination.service';
import {Component,inject,Input,Signal} from '@angular/core';

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
  // Define a Signal Input to update the parent signal
  @Input() searchSignal!: Signal<string>;

  // Call the correct method to update the signal
  private searchService = inject(SearchService);

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.setSearch(value); // Directly update the signal
    console.log('A new signal value from FilterInputSignalComponent', value);
  }

}
