import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSupportComponent } from './article-support.component';

describe('ArticleSupportComponent', () => {
  let component: ArticleSupportComponent;
  let fixture: ComponentFixture<ArticleSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
