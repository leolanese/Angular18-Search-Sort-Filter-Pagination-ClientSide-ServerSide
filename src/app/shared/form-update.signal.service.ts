import {Injectable,signal,WritableSignal} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormUpdateSignalService {
  readonly _formState: WritableSignal<{ username?: string; password?: string }> = signal({});

  get formState() {
    return this._formState.asReadonly(); // Expose as a readonly signal
  }

  updateFormState(value: { username?: string; password?: string }) {
    console.log('SERVICE: Updating form state signal:', value);
    this._formState.set(value);
  }
}
