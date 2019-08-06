import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgmtFooterComponent } from './mgmt-footer.component';

describe('MgmtFooterComponent', () => {
  let component: MgmtFooterComponent;
  let fixture: ComponentFixture<MgmtFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgmtFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgmtFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
