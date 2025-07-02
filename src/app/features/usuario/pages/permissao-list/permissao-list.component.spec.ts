import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissaoListComponent } from './permissao-list.component';

describe('PermissaoListComponent', () => {
  let component: PermissaoListComponent;
  let fixture: ComponentFixture<PermissaoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissaoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
