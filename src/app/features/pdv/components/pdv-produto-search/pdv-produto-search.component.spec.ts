import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdvProdutoSearchComponent } from './pdv-produto-search.component';

describe('PdvProdutoSearchComponent', () => {
  let component: PdvProdutoSearchComponent;
  let fixture: ComponentFixture<PdvProdutoSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdvProdutoSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdvProdutoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
