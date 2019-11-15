import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlSvgItemDocComponent } from './url-svg-item-doc.component';

describe('UrlSvgItemDocComponent', () => {
  let component: UrlSvgItemDocComponent;
  let fixture: ComponentFixture<UrlSvgItemDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlSvgItemDocComponent ]
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
