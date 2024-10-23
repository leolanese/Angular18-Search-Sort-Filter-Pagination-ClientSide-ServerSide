import {CommonModule} from '@angular/common';
import {Component,Input} from '@angular/core';

@Component({
  selector: 'app-list',
  standalone: true,
  template: `
    <ul>
      <li *ngFor="let country of countries">{{ country.name }}</li>
    </ul>
  `,
  imports: [CommonModule]
})
export class ListComponent {
  @Input() countries: any[] = [];
}
