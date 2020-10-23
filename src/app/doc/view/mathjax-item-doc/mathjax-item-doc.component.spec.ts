import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathjaxItemDocComponent } from './mathjax-item-doc.component';

describe('MathjaxItemDocComponent', () => {
  let component: MathjaxItemDocComponent;
  let fixture: ComponentFixture<MathjaxItemDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MathjaxItemDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MathjaxItemDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
