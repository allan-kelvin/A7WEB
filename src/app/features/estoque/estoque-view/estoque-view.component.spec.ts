import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueViewComponent } from './estoque-view.component';

describe('EstoqueViewComponent', () => {
  let component: EstoqueViewComponent;
  let fixture: ComponentFixture<EstoqueViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstoqueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
