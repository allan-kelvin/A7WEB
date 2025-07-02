import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Vendedor } from '../../../../models/vendedor';
import { VendedorService } from '../../../../services/estoque/vendedor/vendedor.service';

@Component({
  selector: 'app-vendedor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendedor-list.component.html',
  styleUrl: './vendedor-list.component.scss'
})
export class VendedorListComponent implements OnInit {

  vendedores: Vendedor[] = []; // Lista original completa vinda do backend
  filteredVendedores: Vendedor[] = []; // Lista filtrada exibida na UI
  isLoading: boolean = true;
  error: string | null = null;

  // Propriedades para os campos de busca
  searchQueryId: string = '';
  searchQueryNome: string = ''; // Campo para busca por nome do vendedor
  searchQueryCodigo: string = ''; // Campo para busca por código do vendedor

  constructor(
    private vendedorService: VendedorService, // Injeta o serviço de vendedor
    private router: Router // Injeta o Router para navegação
  ) { }

  ngOnInit(): void {
    this.loadVendedores();
  }

  /**
   * Carrega a lista completa de vendedores do backend.
   */
  loadVendedores(): void {
    this.isLoading = true;
    this.error = null;
    this.vendedores = []; // Limpa a lista original antes de carregar
    this.filteredVendedores = []; // Limpa a lista filtrada também
    console.log('VendedorListComponent: Iniciando carregamento de vendedores...');

    this.vendedorService.getVendedores().subscribe({
      next: (data) => {
        console.log('VendedorListComponent: Dados recebidos do backend:', data);
        this.vendedores = data; // Armazena a lista completa
        this.applyFilter(); // Aplica o filtro inicial (mostra todos se os campos de busca estiverem vazios)
        this.isLoading = false;
      },
      error: (err) => {
        console.error('VendedorListComponent: Erro ao buscar vendedores:', err);
        this.error = 'Não foi possível carregar os vendedores. Verifique o console para mais detalhes.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica os filtros de busca na lista de vendedores.
   */
  applyFilter(): void {
    console.log('VendedorListComponent: applyFilter chamado. ID:', this.searchQueryId, 'Nome:', this.searchQueryNome, 'Cód. Vendedor:', this.searchQueryCodigo);

    let tempFilteredList = [...this.vendedores]; // Começa com uma cópia da lista completa

    // Filtro por ID
    const idQuery = (this.searchQueryId === null || this.searchQueryId === undefined || this.searchQueryId === '') ? '' : String(this.searchQueryId).trim();
    if (idQuery !== '') {
      const idValue = Number(idQuery);
      if (!isNaN(idValue)) {
        tempFilteredList = tempFilteredList.filter(vendedor => vendedor.id_vendedor === idValue);
      } else {
        console.warn('VendedorListComponent: Consulta de ID inválida:', idQuery);
        tempFilteredList = [];
      }
    }

    // Filtro por Nome do Vendedor
    const nomeQuery = this.searchQueryNome.trim().toLowerCase();
    if (nomeQuery !== '') {
      tempFilteredList = tempFilteredList.filter(vendedor =>
        vendedor.nome_vendedor.toLowerCase().includes(nomeQuery)
      );
    }

    // Filtro por Código do Vendedor
    const codigoQuery = this.searchQueryCodigo.trim().toLowerCase();
    if (codigoQuery !== '') {
      tempFilteredList = tempFilteredList.filter(vendedor =>
        vendedor.cod_vendedor.toLowerCase().includes(codigoQuery)
      );
    }

    this.filteredVendedores = tempFilteredList;
    console.log('VendedorListComponent: Filtro aplicado. Itens resultantes:', this.filteredVendedores.length);
  }

  /**
   * Navega para a tela de edição de um vendedor.
   * @param vendedor O objeto Vendedor a ser editado.
   */
  onEdit(vendedor: Vendedor): void {
    // Redireciona para a rota de edição de vendedor
    this.router.navigate(['/cadastros/vendedor/editar', vendedor.id_vendedor]);
  }

  /**
   * Exclui um vendedor após confirmação.
   * @param id O ID do vendedor a ser excluído.
   */
  onDelete(id: number): void {
    if (confirm(`Tem certeza que deseja excluir o vendedor com ID ${id}?`)) {
      this.vendedorService.deleteVendedor(id).subscribe({
        next: () => {
          console.log(`Vendedor com ID ${id} excluído com sucesso.`);
          // Remove o item da lista original e refiltera para atualizar a UI
          this.vendedores = this.vendedores.filter(v => v.id_vendedor !== id);
          this.applyFilter();
        },
        error: (err) => {
          console.error(`Erro ao excluir vendedor com ID ${id}:`, err);
          this.error = `Não foi possível excluir o vendedor (ID: ${id}).`;
        }
      });
    }
  }

}
