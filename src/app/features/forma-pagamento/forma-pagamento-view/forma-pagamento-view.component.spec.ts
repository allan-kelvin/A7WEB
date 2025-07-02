import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagamentoViewComponent } from './forma-pagamento-view.component';

describe('FormaPagamentoViewComponent', () => {
  let component: FormaPagamentoViewComponent;
  let fixture: ComponentFixture<FormaPagamentoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormaPagamentoViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormaPagamentoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
