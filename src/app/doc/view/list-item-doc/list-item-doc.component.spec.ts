import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemDocComponent } from './list-item-doc.component';

describe('ListItemDocComponent', () => {
  let component: ListItemDocComponent;
  let fixture: ComponentFixture<ListItemDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListItemDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
