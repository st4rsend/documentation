import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocListFinderComponent } from './doc-list-finder.component';

describe('DocListFinderComponent', () => {
  let component: DocListFinderComponent;
  let fixture: ComponentFixture<DocListFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocListFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocListFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
