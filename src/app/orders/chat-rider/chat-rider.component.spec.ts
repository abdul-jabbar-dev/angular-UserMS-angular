import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRiderComponent } from './chat-rider.component';

describe('ChatRiderComponent', () => {
  let component: ChatRiderComponent;
  let fixture: ComponentFixture<ChatRiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatRiderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatRiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
