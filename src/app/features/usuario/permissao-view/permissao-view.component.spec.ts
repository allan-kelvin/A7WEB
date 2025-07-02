import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissaoViewComponent } from './permissao-view.component';

describe('PermissaoViewComponent', () => {
  let component: PermissaoViewComponent;
  let fixture: ComponentFixture<PermissaoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissaoViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissaoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
