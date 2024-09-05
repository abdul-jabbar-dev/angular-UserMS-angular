import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderDashComponent } from './rider-dash.component';

describe('RiderDashComponent', () => {
  let component: RiderDashComponent;
  let fixture: ComponentFixture<RiderDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiderDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
