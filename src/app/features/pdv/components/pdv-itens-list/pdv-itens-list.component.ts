import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Produto } from '../../../../models/produto.models';

@Component({
  selector: 'app-pdv-itens-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdv-itens-list.component.html',
  styleUrl: './pdv-itens-list.component.scss'
})
export class PdvItensListComponent {
  @Input() itens: Produto[] = [];
  constructor() { }
}
