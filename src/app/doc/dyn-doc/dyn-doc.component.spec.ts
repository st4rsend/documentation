import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynDocComponent } from './dyn-doc.component';

describe('DynDocComponent', () => {
  let component: DynDocComponent;
  let fixture: ComponentFixture<DynDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
