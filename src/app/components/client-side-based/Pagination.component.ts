import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy,Component,EventEmitter,Input,Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div>
      <button type="button" (click)="previousPage()" [disabled]="currentPage <= 0">Previous</button>
      <button type="button" (click)="nextPage()" [disabled]="currentPage >= totalPages - 1">Next</button>
      <p>Page {{ currentPage + 1 }} of {{ totalPages }}</p>
    </div>
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;

  @Output() pageChange = new EventEmitter<number>();

  nextPage() {
    this.pageChange.emit(this.currentPage + 1);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }
  
}
