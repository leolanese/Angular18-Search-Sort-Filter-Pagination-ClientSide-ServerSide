import {Component,OnInit,inject} from '@angular/core';

import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message$ = new Subject<string>();

  show(message: string): void {
    this.message$.next(message);
  }
}

@Component({
  selector: 'app-toast-modal',
  standalone: true,
  template: `
    @if (message) {
      <div class="toast">{{ message }}</div>
    }
  `,
  styles: `
    .toast {
      min-width: 250px;
      margin-left: -125px;
      background-color: #333;
      color: #fff;
      text-align: center;
      border-radius: .35em;
      padding: 1em;
      position: fixed;
      z-index: 1;
      left: 50%;
      bottom: .45em;
    }
  `,
})
export class ToastModalComponent implements OnInit {
  toastService = inject(ToastService);
  message = '';

  ngOnInit(): void {
    let handle: unknown;
    this.toastService.message$.subscribe((message: string) => {
      clearTimeout(handle as number);
      this.message = message;
      handle = setTimeout(() => {
        this.message = '';
      }, 3000);
    });
  }
}
