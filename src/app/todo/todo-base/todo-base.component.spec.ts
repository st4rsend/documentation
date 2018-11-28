import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoBaseComponent } from './todo-base.component';

describe('TodoBaseComponent', () => {
  let component: TodoBaseComponent;
  let fixture: ComponentFixture<TodoBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
