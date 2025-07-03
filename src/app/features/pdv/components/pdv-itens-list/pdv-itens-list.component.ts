import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output() itemRemovido = new EventEmitter<number>(); // índice do item a ser removido

  confirmarRemocao(index: number): void {
    const produto = this.itens[index];
    const confirmacao = confirm(`Deseja remover o produto "${produto.nome}" da venda?`);
    if (confirmacao) {
      this.itemRemovido.emit(index);
    }
  }
  constructor() { }
}
