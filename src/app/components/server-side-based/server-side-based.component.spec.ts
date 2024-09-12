import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSideBasedComponent } from './server-side-based.component';

describe('ServerSideBasedComponent', () => {
  let component: ServerSideBasedComponent;
  let fixture: ComponentFixture<ServerSideBasedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerSideBasedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerSideBasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
