import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerSupportComponent } from './answer-support.component';

describe('AnswerSupportComponent', () => {
  let component: AnswerSupportComponent;
  let fixture: ComponentFixture<AnswerSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnswerSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
