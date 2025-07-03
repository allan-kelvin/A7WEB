import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Produto } from '../../../../models/produto.models';
import { ProdutoService } from '../../../../services/produtos/produto.service';

@Component({
  selector: 'app-pdv-produto-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pdv-produto-search.component.html',
  styleUrl: './pdv-produto-search.component.scss'
})
export class PdvProdutoSearchComponent implements OnInit {
  searchQuery: string = '';
  searchResults: Produto[] = [];
  isLoading: boolean = false;
  selectedProduct: Produto | null = null;
  showSuggestions = false;
  activeSuggestionIndex = -1;

  @Output() produtoAdicionado = new EventEmitter<Produto>(); // Emite o produto para ser adicionado
  @Output() produtoSelecionadoParaDisplay = new EventEmitter<Produto | null>(); // Emite o produto selecionado para display no pai

  private searchTerms = new Subject<string>(); // Observable para os termos de busca

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.isLoading = true;
        this.searchResults = [];
        this.selectedProduct = null; // Limpa o produto selecionado ao iniciar nova busca
        this.produtoSelecionadoParaDisplay.emit(null); // Notifica o pai que nenhum produto está selecionado para display
        if (term.trim() === '') {
          this.isLoading = false;
          return [];
        }
        // Simulação de busca no frontend. Em um cenário real, você chamaria um endpoint de busca no backend
        // Ex: return this.produtoService.searchProdutos(term);
        return this.produtoService.getProdutos().pipe(
          map((produtos: Produto[]) => {
            const termLower = term.toLowerCase();
            return produtos.filter(p =>
              p.nome.toLowerCase().includes(termLower) ||
              (p.id_produto && String(p.id_produto) === term) || // Busca exata por ID
              (p.codigo_barras && p.codigo_barras.includes(term))
            );
          })
        );
      })
    ).subscribe({
      next: (produtos: Produto[]) => {
        this.searchResults = produtos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro na busca de produtos:', err);
        this.isLoading = false;
        this.searchResults = [];
      }
    });
  }

  onSearch(term: string): void {
    if (!term.trim()) {
      this.searchResults = [];
      this.showSuggestions = false;
      return;
    }

    this.isLoading = true;
    this.produtoService.getProdutos().subscribe(produtos => {
      const termLower = term.toLowerCase();

      // Busca por código exato ou nome parcial
      this.searchResults = produtos.filter(p =>
        p.id_produto === Number(term) ||
        p.codigo_barras === term ||
        p.nome.toLowerCase().includes(termLower)
      );

      this.isLoading = false;
      this.showSuggestions = this.searchResults.length > 0;
      this.activeSuggestionIndex = -1;
    });
  }

  /**
   * Seleciona um produto da lista de resultados e o prepara para adição.
   * @param produto O produto selecionado.
   */
  selectProduct(produto: Produto): void {
    this.produtoAdicionado.emit(produto);
    this.searchQuery = '';
    this.searchResults = [];
    this.showSuggestions = false;
    this.activeSuggestionIndex = -1;
    this.selectedProduct = produto;
    this.produtoSelecionadoParaDisplay.emit(produto); // Notifica o pai que um produto foi selecionado para display
  }

  /**
   * Adiciona o produto selecionado à venda.
   * Chamado ao pressionar Enter no input ou dblclick no item da lista.
   */
  addProductToSale(): void {
    if (this.selectedProduct) {
      this.produtoAdicionado.emit(this.selectedProduct); // Emite o produto selecionado para o pai
      this.searchQuery = ''; // Limpa o campo de busca
      this.selectedProduct = null; // Limpa o produto selecionado
      this.produtoSelecionadoParaDisplay.emit(null); // Notifica o pai que o produto foi adicionado e limpa o display
    } else if (this.searchResults.length === 1) {
      // Se houver apenas um resultado, seleciona e adiciona automaticamente
      this.selectProduct(this.searchResults[0]);
      // Chama novamente para emitir após a seleção (próximo ciclo do Angular)
      setTimeout(() => this.addProductToSale(), 0);
    } else {
      console.warn('Nenhum produto selecionado ou resultado único para adicionar.');
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions) return;

    if (event.key === 'ArrowDown') {
      // Move para baixo na lista
      event.preventDefault();
      this.activeSuggestionIndex = Math.min(this.activeSuggestionIndex + 1, this.searchResults.length - 1);
    } else if (event.key === 'ArrowUp') {
      // Move para cima na lista
      event.preventDefault();
      this.activeSuggestionIndex = Math.max(this.activeSuggestionIndex - 1, 0);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.activeSuggestionIndex >= 0) {
        this.selectProduct(this.searchResults[this.activeSuggestionIndex]);
      } else if (this.searchResults.length === 1) {
        this.selectProduct(this.searchResults[0]);
      }
    }
  }
}
