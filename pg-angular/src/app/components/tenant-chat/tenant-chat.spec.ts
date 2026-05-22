import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantChat } from './tenant-chat';

describe('TenantChat', () => {
  let component: TenantChat;
  let fixture: ComponentFixture<TenantChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
