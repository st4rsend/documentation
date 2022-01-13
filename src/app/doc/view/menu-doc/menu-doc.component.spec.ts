import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuDocComponent } from './menu-doc.component';

describe('MenuDocComponent', () => {
  let component: MenuDocComponent;
  let fixture: ComponentFixture<MenuDocComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [MenuDocComponent],
    teardown: { destroyAfterEach: false }
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
