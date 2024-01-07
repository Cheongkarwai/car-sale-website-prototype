import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNowBtnComponent } from './chat-now-btn.component';

describe('ChatNowBtnComponent', () => {
  let component: ChatNowBtnComponent;
  let fixture: ComponentFixture<ChatNowBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatNowBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatNowBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
