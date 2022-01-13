import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocListFinderComponent } from './doc-list-finder.component';

describe('DocListFinderComponent', () => {
  let component: DocListFinderComponent;
  let fixture: ComponentFixture<DocListFinderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [DocListFinderComponent],
    teardown: { destroyAfterEach: false }
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
