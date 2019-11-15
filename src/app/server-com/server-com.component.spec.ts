import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerComComponent } from './server-com.component';

describe('ServerComComponent', () => {
  let component: ServerComComponent;
  let fixture: ComponentFixture<ServerComComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerComComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerComComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
