import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTenant } from './edit-tenant';

describe('EditTenant', () => {
  let component: EditTenant;
  let fixture: ComponentFixture<EditTenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTenant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTenant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
