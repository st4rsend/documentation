import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MgmtBaseComponent } from './mgmt-base.component';

describe('MgmtBaseComponent', () => {
  let component: MgmtBaseComponent;
  let fixture: ComponentFixture<MgmtBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MgmtBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgmtBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
