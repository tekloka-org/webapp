import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionSupportComponent } from './permission-support.component';

describe('PermissionSupportComponent', () => {
  let component: PermissionSupportComponent;
  let fixture: ComponentFixture<PermissionSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
