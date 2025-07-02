import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdvViewComponent } from './pdv-view.component';

describe('PdvViewComponent', () => {
  let component: PdvViewComponent;
  let fixture: ComponentFixture<PdvViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdvViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdvViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
