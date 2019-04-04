import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextItemDocComponent } from './text-item-doc.component';

describe('TextItemDocComponent', () => {
  let component: TextItemDocComponent;
  let fixture: ComponentFixture<TextItemDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextItemDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextItemDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
