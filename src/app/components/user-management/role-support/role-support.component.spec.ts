import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSupportComponent } from './role-support.component';

describe('RoleSupportComponent', () => {
  let component: RoleSupportComponent;
  let fixture: ComponentFixture<RoleSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
