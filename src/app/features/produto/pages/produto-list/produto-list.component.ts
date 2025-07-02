
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Necessário para ngModel
import { Router } from '@angular/router'; // Necessário para navegação
import { Produto } from '../../../../models/produto.models';
import { ProdutoService } from '../../../../services/produtos/produto.service';


@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importe FormsModule aqui
  templateUrl: './produto-list.component.html',
  styleUrl: './produto-list.component.scss'
})
export class ProdutoListComponent implements OnInit {
  produtos: Produto[] = []; // Lista original completa vinda do backend
  filteredProdutos: Produto[] = []; // Lista filtrada exibida na UI
  isLoading: boolean = true;
  error: string | null = null;

  // Propriedades para os campos de busca
  searchQueryId: string = '';
  searchQueryNome: string = ''; // Campo para busca por nome
  searchQueryCodigoBarras: string = ''; // Campo para busca por código de barras

  constructor(
    private produtoService: ProdutoService, // Injeta o serviço de produto
    private router: Router // Injeta o Router para navegação
  ) { }

  ngOnInit(): void {
    this.loadProdutos();
  }

  /**
   * Carrega a lista completa de produtos do backend.
   */
  loadProdutos(): void {
    this.isLoading = true;
    this.error = null;
    this.produtos = []; // Limpa a lista original antes de carregar
    this.filteredProdutos = []; // Limpa a lista filtrada também
    console.log('ProdutoListComponent: Iniciando carregamento de produtos...');

    this.produtoService.getProdutos().subscribe({
      next: (data) => {
        console.log('ProdutoListComponent: Dados recebidos do backend:', data);
        this.produtos = data; // Armazena a lista completa
        this.applyFilter(); // Aplica o filtro inicial (mostra todos se os campos de busca estiverem vazios)
        this.isLoading = false;
      },
      error: (err) => {
        console.error('ProdutoListComponent: Erro ao buscar produtos:', err);
        this.error = 'Não foi possível carregar os produtos. Verifique o console para mais detalhes.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica os filtros de busca na lista de produtos.
   */
  applyFilter(): void {
    console.log('ProdutoListComponent: applyFilter chamado. ID:', this.searchQueryId, 'Nome:', this.searchQueryNome, 'Cód. Barras:', this.searchQueryCodigoBarras);

    let tempFilteredList = [...this.produtos]; // Começa com uma cópia da lista completa

    // Filtro por ID
    const idQuery = (this.searchQueryId === null || this.searchQueryId === undefined || this.searchQueryId === '') ? '' : String(this.searchQueryId).trim();
    if (idQuery !== '') {
      const idValue = Number(idQuery);
      if (!isNaN(idValue)) {
        tempFilteredList = tempFilteredList.filter(produto => produto.id_produto === idValue);
      } else {
        console.warn('ProdutoListComponent: Consulta de ID inválida:', idQuery);
        tempFilteredList = []; // Se o ID for inválido, não mostra resultados para o critério ID
      }
    }

    // Filtro por Nome
    const nomeQuery = this.searchQueryNome.trim().toLowerCase();
    if (nomeQuery !== '') {
      tempFilteredList = tempFilteredList.filter(produto =>
        produto.nome.toLowerCase().includes(nomeQuery)
      );
    }

    // Filtro por Código de Barras
    const codigoBarrasQuery = this.searchQueryCodigoBarras.trim();
    if (codigoBarrasQuery !== '') {
      tempFilteredList = tempFilteredList.filter(produto =>
        // Verifica se o codigo_barras existe antes de chamar includes
        produto.codigo_barras?.includes(codigoBarrasQuery)
      );
    }

    this.filteredProdutos = tempFilteredList;
    console.log('ProdutoListComponent: Filtro aplicado. Itens resultantes:', this.filteredProdutos.length);
  }

  /**
   * Navega para a tela de edição de um produto.
   * @param produto O objeto Produto a ser editado.
   */
  onEdit(produto: Produto): void {
    // Redireciona para a rota de edição de produto
    this.router.navigate(['/cadastros/produto/editar', produto.id_produto]);
  }

  /**
   * Exclui um produto após confirmação.
   * @param id O ID do produto a ser excluído.
   */
  onDelete(id: number): void {
    if (confirm(`Tem certeza que deseja excluir o produto com ID ${id}?`)) {
      this.produtoService.deleteProduto(id).subscribe({
        next: () => {
          console.log(`Produto com ID ${id} excluído com sucesso.`);
          // Remove o item da lista original e refiltera para atualizar a UI
          this.produtos = this.produtos.filter(p => p.id_produto !== id);
          this.applyFilter();
        },
        error: (err) => {
          console.error(`Erro ao excluir produto com ID ${id}:`, err);
          this.error = `Não foi possível excluir o produto (ID: ${id}).`;
        }
      });
    }
  }
}
