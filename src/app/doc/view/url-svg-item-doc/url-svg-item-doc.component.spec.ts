import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UrlSvgItemDocComponent } from './url-svg-item-doc.component';

describe('UrlSvgItemDocComponent', () => {
  let component: UrlSvgItemDocComponent;
  let fixture: ComponentFixture<UrlSvgItemDocComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [UrlSvgItemDocComponent],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlSvgItemDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
