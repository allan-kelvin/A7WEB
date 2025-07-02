import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Produto } from '../../../models/produto.models';
import { PdvItensListComponent } from '../components/pdv-itens-list/pdv-itens-list.component';
import { PdvProdutoSearchComponent } from '../components/pdv-produto-search/pdv-produto-search.component';
import { PdvItem } from '../pdv-item.module';

@Component({
  selector: 'app-pdv-view',
  standalone: true,
  imports: [CommonModule, FormsModule, PdvItensListComponent, PdvProdutoSearchComponent], // ADICIONAR FormsModule
  templateUrl: './pdv-view.component.html',
  styleUrl: './pdv-view.component.scss'
})
export class PdvViewComponent implements OnInit {
  itensVenda: PdvItem[] = [];
  totalVenda: number = 0;
  currentQuantity: number = 1;
  selectedProductForDisplay: Produto | null = null;

  constructor() { }

  ngOnInit(): void {
    // Inicialização, se necessário
  }

  /**
   * Recebe o produto selecionado do componente de busca para exibir seu preço.
   * @param produto O produto selecionado para display.
   */
  onProdutoSelecionadoParaDisplay(produto: Produto | null): void {
    this.selectedProductForDisplay = produto;
    // Se um produto for selecionado, podemos preencher o campo de quantidade com 1 (ou manter o que o usuário digitou)
    // E o preço unitário será exibido no HTML.
  }

  /**
   * Adiciona um produto à lista de itens da venda ou atualiza a quantidade se já existir.
   * @param produto O produto a ser adicionado/atualizado.
   */
  onProdutoAdicionado(produto: Produto): void {
    const existingItem = this.itensVenda.find(item => item.id_produto === produto.id_produto);

    const quantityToAdd = this.currentQuantity > 0 ? this.currentQuantity : 1; // Garante quantidade mínima de 1

    if (existingItem) {
      // Se o produto já existe, incrementa a quantidade
      existingItem.quantidade += quantityToAdd;
      existingItem.subtotal = existingItem.quantidade * (existingItem.preco || 0);
    } else {
      // Se o produto não existe, adiciona como um novo PdvItem
      const newItem: PdvItem = {
        ...produto, // Copia todas as propriedades do Produto
        quantidade: quantityToAdd, // Usa a quantidade digitada
        subtotal: quantityToAdd * (produto.preco || 0) // Calcula subtotal
      };
      this.itensVenda.push(newItem);
    }
    this.recalculateTotal();
    this.currentQuantity = 1; // Reseta a quantidade para 1 após adicionar
    this.selectedProductForDisplay = null; // Limpa o produto de display após adição
    console.log('Produto adicionado/atualizado no PDV:', produto, 'Quantidade:', quantityToAdd);
  }

  /**
   * Recalcula o total da venda com base nos subtotais dos itens.
   */
  recalculateTotal(): void {
    this.totalVenda = this.itensVenda.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  }

  /**
   * Lógica para finalizar a venda.
   */
  finalizarVenda(): void {
    console.log('Finalizar Venda clicado. Itens:', this.itensVenda, 'Total:', this.totalVenda);
    // Aqui você chamaria o VendasService para enviar a venda para o backend.
    alert('Venda finalizada (Lógica de backend ainda não implementada aqui).');
  }

  /**
   * Lógica para cancelar a venda.
   */
  cancelarVenda(): void {
    console.log('Cancelar Venda clicado.');
    this.itensVenda = []; // Limpa os itens
    this.totalVenda = 0; // Zera o total
    this.currentQuantity = 1; // Reseta a quantidade
    this.selectedProductForDisplay = null; // Limpa o produto de display
    alert('Venda cancelada.');
  }
}
