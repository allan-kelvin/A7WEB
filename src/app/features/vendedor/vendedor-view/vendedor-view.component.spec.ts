import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendedorViewComponent } from './vendedor-view.component';

describe('VendedorViewComponent', () => {
  let component: VendedorViewComponent;
  let fixture: ComponentFixture<VendedorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendedorViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendedorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
