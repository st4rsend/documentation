import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSelectDocComponent } from './list-select-doc.component';

describe('ListSelectDocComponent', () => {
  let component: ListSelectDocComponent;
  let fixture: ComponentFixture<ListSelectDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSelectDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSelectDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
