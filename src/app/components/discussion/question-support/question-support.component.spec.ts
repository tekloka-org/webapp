import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSupportComponent } from './question-support.component';

describe('QuestionSupportComponent', () => {
  let component: QuestionSupportComponent;
  let fixture: ComponentFixture<QuestionSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
