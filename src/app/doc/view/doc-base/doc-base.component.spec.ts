import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocBaseComponent } from './doc-base.component';

describe('DocBaseComponent', () => {
  let component: DocBaseComponent;
  let fixture: ComponentFixture<DocBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [DocBaseComponent],
    teardown: { destroyAfterEach: false }
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
