import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TextItemDocComponent } from './text-item-doc.component';

describe('TextItemDocComponent', () => {
  let component: TextItemDocComponent;
  let fixture: ComponentFixture<TextItemDocComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [TextItemDocComponent],
    teardown: { destroyAfterEach: false }
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
