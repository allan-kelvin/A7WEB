import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteViewComponent } from './cliente-view.component';

describe('ClienteViewComponent', () => {
  let component: ClienteViewComponent;
  let fixture: ComponentFixture<ClienteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
