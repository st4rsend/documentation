import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTextareaDocComponent } from './edit-textarea-doc.component';

describe('EditTextareaDocComponent', () => {
  let component: EditTextareaDocComponent;
  let fixture: ComponentFixture<EditTextareaDocComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [EditTextareaDocComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTextareaDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
