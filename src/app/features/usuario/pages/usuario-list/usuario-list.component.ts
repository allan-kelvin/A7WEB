import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Necessário para ngModel
import { Router } from '@angular/router';
import { Usuario } from '../../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario/usuario.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit {

  usuarios: Usuario[] = []; // Lista original completa vinda do backend
  filteredUsuarios: Usuario[] = []; // Lista filtrada exibida na UI
  isLoading: boolean = true;
  error: string | null = null;

  // Propriedades para os campos de busca
  searchQueryId: string = '';
  searchQueryNome: string = ''; // Campo para busca por nome
  searchQueryCpf: string = ''; // Campo para busca por CPF
  searchQueryEmail: string = ''; // Campo para busca por Email

  constructor(
    private usuarioService: UsuarioService, // Injeta o serviço de usuário
    private router: Router // Injeta o Router para navegação
  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  /**
   * Carrega a lista completa de usuários do backend.
   */
  loadUsuarios(): void {
    this.isLoading = true;
    this.error = null;
    this.usuarios = []; // Limpa a lista original antes de carregar
    this.filteredUsuarios = []; // Limpa a lista filtrada também
    console.log('UsuarioListComponent: Iniciando carregamento de usuários...');

    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log('UsuarioListComponent: Dados recebidos do backend:', data);
        this.usuarios = data; // Armazena a lista completa
        this.applyFilter(); // Aplica o filtro inicial (mostra todos se os campos de busca estiverem vazios)
        this.isLoading = false;
      },
      error: (err) => {
        console.error('UsuarioListComponent: Erro ao buscar usuários:', err);
        this.error = 'Não foi possível carregar os usuários. Verifique o console para mais detalhes.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica os filtros de busca na lista de usuários.
   */
  applyFilter(): void {
    console.log('UsuarioListComponent: applyFilter chamado. ID:', this.searchQueryId, 'Nome:', this.searchQueryNome, 'CPF:', this.searchQueryCpf, 'Email:', this.searchQueryEmail);

    let tempFilteredList = [...this.usuarios]; // Começa com uma cópia da lista completa

    // Filtro por ID
    const idQuery = (this.searchQueryId === null || this.searchQueryId === undefined || this.searchQueryId === '') ? '' : String(this.searchQueryId).trim();
    if (idQuery !== '') {
      const idValue = Number(idQuery);
      if (!isNaN(idValue)) {
        tempFilteredList = tempFilteredList.filter(usuario => usuario.id_usuario === idValue);
      } else {
        console.warn('UsuarioListComponent: Consulta de ID inválida:', idQuery);
        tempFilteredList = [];
      }
    }

    // Filtro por Nome
    const nomeQuery = this.searchQueryNome.trim().toLowerCase();
    if (nomeQuery !== '') {
      tempFilteredList = tempFilteredList.filter(usuario =>
        usuario.nome.toLowerCase().includes(nomeQuery)
      );
    }

    // Filtro por CPF
    const cpfQuery = this.searchQueryCpf.trim();
    if (cpfQuery !== '') {
      tempFilteredList = tempFilteredList.filter(usuario =>
        usuario.cpf.includes(cpfQuery)
      );
    }

    // Filtro por Email
    const emailQuery = this.searchQueryEmail.trim().toLowerCase();
    if (emailQuery !== '') {
      tempFilteredList = tempFilteredList.filter(usuario =>
        usuario.email?.toLowerCase().includes(emailQuery) // Usa ?. para email que pode ser null
      );
    }

    this.filteredUsuarios = tempFilteredList;
    console.log('UsuarioListComponent: Filtro aplicado. Itens resultantes:', this.filteredUsuarios.length);
  }

  /**
   * Navega para a tela de edição de um usuário.
   * @param usuario O objeto Usuario a ser editado.
   */
  onEdit(usuario: Usuario): void {
    // Redireciona para a rota de edição de usuário
    this.router.navigate(['/cadastros/usuario/editar', usuario.id_usuario]);
  }

  /**
   * Exclui um usuário após confirmação.
   * @param id O ID do usuário a ser excluído.
   */
  onDelete(id: number): void {
    if (confirm(`Tem certeza que deseja excluir o usuário com ID ${id}?`)) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          console.log(`Usuário com ID ${id} excluído com sucesso.`);
          // Remove o item da lista original e refiltera para atualizar a UI
          this.usuarios = this.usuarios.filter(u => u.id_usuario !== id);
          this.applyFilter();
        },
        error: (err) => {
          console.error(`Erro ao excluir usuário com ID ${id}:`, err);
          this.error = `Não foi possível excluir o usuário (ID: ${id}).`;
        }
      });
    }
  }

}
