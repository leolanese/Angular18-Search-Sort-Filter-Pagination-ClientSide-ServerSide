import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSideBasedComponent } from './client-side-based.component';

describe('ClientSideBasedComponent', () => {
  let component: ClientSideBasedComponent;
  let fixture: ComponentFixture<ClientSideBasedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSideBasedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSideBasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
