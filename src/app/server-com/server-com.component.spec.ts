import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServerComComponent } from './server-com.component';

describe('ServerComComponent', () => {
  let component: ServerComComponent;
  let fixture: ComponentFixture<ServerComComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ServerComComponent],
    teardown: { destroyAfterEach: false }
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
