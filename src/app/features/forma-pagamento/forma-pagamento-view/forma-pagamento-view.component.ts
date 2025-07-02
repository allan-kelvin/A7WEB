import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-forma-pagamento-view',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './forma-pagamento-view.component.html',
  styleUrl: './forma-pagamento-view.component.scss'
})
export class FormaPagamentoViewComponent {

  constructor() { }
}
