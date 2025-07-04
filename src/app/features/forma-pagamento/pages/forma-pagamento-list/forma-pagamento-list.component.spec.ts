import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagamentoListComponent } from './forma-pagamento-list.component';

describe('FormaPagamentoListComponent', () => {
  let component: FormaPagamentoListComponent;
  let fixture: ComponentFixture<FormaPagamentoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormaPagamentoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormaPagamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
