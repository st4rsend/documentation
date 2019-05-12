import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMgmtComponent } from './list-mgmt.component';

describe('ListMgmtComponent', () => {
  let component: ListMgmtComponent;
  let fixture: ComponentFixture<ListMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
