import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgSampleComponent } from './svg-sample.component';

describe('SvgSampleComponent', () => {
  let component: SvgSampleComponent;
  let fixture: ComponentFixture<SvgSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
