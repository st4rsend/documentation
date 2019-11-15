import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgItemDocComponent } from './svg-item-doc.component';

describe('SvgItemDocComponent', () => {
  let component: SvgItemDocComponent;
  let fixture: ComponentFixture<SvgItemDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgItemDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgItemDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
