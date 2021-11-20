import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySupportComponent } from './category-support.component';

describe('CategorySupportComponent', () => {
  let component: CategorySupportComponent;
  let fixture: ComponentFixture<CategorySupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorySupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
