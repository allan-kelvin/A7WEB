import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdvItensListComponent } from './pdv-itens-list.component';

describe('PdvItensListComponent', () => {
  let component: PdvItensListComponent;
  let fixture: ComponentFixture<PdvItensListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdvItensListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdvItensListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
