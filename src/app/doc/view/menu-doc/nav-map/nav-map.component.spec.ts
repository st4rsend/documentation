import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavMapComponent } from './nav-map.component';

describe('NavMapComponent', () => {
  let component: NavMapComponent;
  let fixture: ComponentFixture<NavMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
