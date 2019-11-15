import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocBaseComponent } from './doc-base.component';

describe('DocBaseComponent', () => {
  let component: DocBaseComponent;
  let fixture: ComponentFixture<DocBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
