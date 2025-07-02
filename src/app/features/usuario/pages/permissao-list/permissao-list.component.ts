import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Permissao } from '../../../../models/permissao';
import { PermissaoService } from '../../../../services/permissao/permissao.service';

@Component({
  selector: 'app-permissao-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permissao-list.component.html',
  styleUrl: './permissao-list.component.scss'
})
export class PermissaoListComponent implements OnInit {

  permissoes: Permissao[] = []; // Lista original completa vinda do backend
  filteredPermissoes: Permissao[] = []; // Lista filtrada exibida na UI
  isLoading: boolean = true;
  error: string | null = null;

  // Propriedades para os campos de busca
  searchQueryPermissaoId: string = ''; // Busca por ID da Permissão
  searchQueryUsuarioId: string = ''; // Busca por ID do Usuário

  constructor(
    private permissaoService: PermissaoService, // Injeta o serviço de permissão
    private router: Router // Injeta o Router para navegação
  ) { }

  ngOnInit(): void {
    this.loadPermissoes();
  }

  /**
   * Carrega a lista completa de permissões do backend.
   */
  loadPermissoes(): void {
    this.isLoading = true;
    this.error = null;
    this.permissoes = []; // Limpa a lista original antes de carregar
    this.filteredPermissoes = []; // Limpa a lista filtrada também
    console.log('PermissaoListComponent: Iniciando carregamento de permissões...');

    this.permissaoService.getPermissoes().subscribe({
      next: (data) => {
        console.log('PermissaoListComponent: Dados recebidos do backend:', data);
        this.permissoes = data; // Armazena a lista completa
        this.applyFilter(); // Aplica o filtro inicial (mostra todos se os campos de busca estiverem vazios)
        this.isLoading = false;
      },
      error: (err) => {
        console.error('PermissaoListComponent: Erro ao buscar permissões:', err);
        this.error = 'Não foi possível carregar as permissões. Verifique o console para mais detalhes.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica os filtros de busca na lista de permissões.
   */
  applyFilter(): void {
    console.log('PermissaoListComponent: applyFilter chamado. Permissão ID:', this.searchQueryPermissaoId, 'Usuário ID:', this.searchQueryUsuarioId);

    let tempFilteredList = [...this.permissoes]; // Começa com uma cópia da lista completa

    // Filtro por ID da Permissão
    const permissaoIdQuery = (this.searchQueryPermissaoId === null || this.searchQueryPermissaoId === undefined || this.searchQueryPermissaoId === '') ? '' : String(this.searchQueryPermissaoId).trim();
    if (permissaoIdQuery !== '') {
      const idValue = Number(permissaoIdQuery);
      if (!isNaN(idValue)) {
        tempFilteredList = tempFilteredList.filter(permissao => permissao.id_permissao === idValue);
      } else {
        console.warn('PermissaoListComponent: Consulta de ID de Permissão inválida:', permissaoIdQuery);
        tempFilteredList = [];
      }
    }

    // Filtro por ID do Usuário
    const usuarioIdQuery = (this.searchQueryUsuarioId === null || this.searchQueryUsuarioId === undefined || this.searchQueryUsuarioId === '') ? '' : String(this.searchQueryUsuarioId).trim();
    if (usuarioIdQuery !== '') {
      const idValue = Number(usuarioIdQuery);
      if (!isNaN(idValue)) {
        tempFilteredList = tempFilteredList.filter(permissao => permissao.id_usuario === idValue);
      } else {
        console.warn('PermissaoListComponent: Consulta de ID de Usuário inválida:', usuarioIdQuery);
        tempFilteredList = [];
      }
    }

    this.filteredPermissoes = tempFilteredList;
    console.log('PermissaoListComponent: Filtro aplicado. Itens resultantes:', this.filteredPermissoes.length);
  }

  /**
   * Navega para a tela de edição de uma permissão.
   * @param permissao O objeto Permissao a ser editado.
   */
  onEdit(permissao: Permissao): void {
    // Redireciona para a rota de edição de permissão
    this.router.navigate(['/cadastros/usuario/permissoes/editar', permissao.id_permissao]);
  }

  /**
   * Exclui uma permissão após confirmação.
   * @param id O ID da permissão a ser excluída.
   */
  onDelete(id: number): void {
    if (confirm(`Tem certeza que deseja excluir a permissão com ID ${id}?`)) {
      this.permissaoService.deletePermissao(id).subscribe({
        next: () => {
          console.log(`Permissão com ID ${id} excluída com sucesso.`);
          // Remove o item da lista original e refiltera para atualizar a UI
          this.permissoes = this.permissoes.filter(p => p.id_permissao !== id);
          this.applyFilter();
        },
        error: (err) => {
          console.error(`Erro ao excluir permissão com ID ${id}:`, err);
          this.error = `Não foi possível excluir a permissão (ID: ${id}).`;
        }
      });
    }
  }

}
