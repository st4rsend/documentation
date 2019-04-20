import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemDocComponent } from './edit-item-doc.component';

describe('EditItemDocComponent', () => {
  let component: EditItemDocComponent;
  let fixture: ComponentFixture<EditItemDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemDocComponent ]
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
