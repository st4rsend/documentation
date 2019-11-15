import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDocComponent } from './menu-doc.component';

describe('MenuDocComponent', () => {
  let component: MenuDocComponent;
  let fixture: ComponentFixture<MenuDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
