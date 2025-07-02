import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagamentoFormComponent } from './forma-pagamento-form.component';

describe('FormaPagamentoFormComponent', () => {
  let component: FormaPagamentoFormComponent;
  let fixture: ComponentFixture<FormaPagamentoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormaPagamentoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormaPagamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
