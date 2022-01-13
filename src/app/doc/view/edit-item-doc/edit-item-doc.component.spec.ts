import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditItemDocComponent } from './edit-item-doc.component';

describe('EditItemDocComponent', () => {
  let component: EditItemDocComponent;
  let fixture: ComponentFixture<EditItemDocComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [EditItemDocComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
