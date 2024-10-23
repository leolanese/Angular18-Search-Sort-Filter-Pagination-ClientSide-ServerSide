import {CommonModule} from '@angular/common';
import {Component,EventEmitter,Input,Output} from '@angular/core';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-dummy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h3>{{ user.name }} : {{ user.id }}</h3>
      <p class="username">Username: {{ user.username }}</p>
      <p class="email">Email: {{ user.email }}</p>
      <button (click)="fetchData()">Fetch Data</button>
    </div>
  `,
  styleUrl: './dummy.component.scss'
})
export class DummyComponent {
  @Input() user!: User;  // Receive from Parent

  @Output() fetchDataEvent = new EventEmitter<void>(); // Send to Parent

  fetchData() {
    this.fetchDataEvent.next();
  }

}