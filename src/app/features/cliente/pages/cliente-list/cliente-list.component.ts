import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../../../models/cliente';
import { ClienteService } from '../../../../services/clientes/cliente.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.scss'
})
export class ClienteListComponent implements OnInit {

  clientes: Cliente[] = []; // Lista original completa vinda do backend
      filteredClientes: Cliente[] = []; // Lista filtrada exibida na UI
      isLoading: boolean = true;
      error: string | null = null;

      // Propriedades para os campos de busca
      searchQueryId: string = '';
      searchQueryNome: string = ''; // Novo campo para busca por nome
      searchQueryCpf: string = ''; // Novo campo para busca por CPF

      constructor(
        private clienteService: ClienteService, // Injeta o serviço de cliente
        private router: Router // Injeta o Router para navegação
      ) { }

      ngOnInit(): void {
        this.loadClientes();
      }

      /**
       * Carrega a lista completa de clientes do backend.
       */
      loadClientes(): void {
        this.isLoading = true;
        this.error = null;
        this.clientes = []; // Limpa a lista original antes de carregar
        this.filteredClientes = []; // Limpa a lista filtrada também
        console.log('ClienteListComponent: Iniciando carregamento de clientes...');

        this.clienteService.getClientes().subscribe({
          next: (data) => {
            console.log('ClienteListComponent: Dados recebidos do backend:', data);
            this.clientes = data; // Armazena a lista completa
            this.applyFilter(); // Aplica o filtro inicial (mostra todos se os campos de busca estiverem vazios)
            this.isLoading = false;
          },
          error: (err) => {
            console.error('ClienteListComponent: Erro ao buscar clientes:', err);
            this.error = 'Não foi possível carregar os clientes. Verifique o console para mais detalhes.';
            this.isLoading = false;
          }
        });
      }

      /**
       * Aplica os filtros de busca na lista de clientes.
       */
      applyFilter(): void {
        console.log('ClienteListComponent: applyFilter chamado. ID:', this.searchQueryId, 'Nome:', this.searchQueryNome, 'CPF:', this.searchQueryCpf);

        let tempFilteredList = [...this.clientes]; // Começa com uma cópia da lista completa

        // Filtro por ID
        const idQuery = String(this.searchQueryId).trim();
        if (idQuery !== '') {
          const idValue = Number(idQuery);
          if (!isNaN(idValue)) {
            tempFilteredList = tempFilteredList.filter(cliente => cliente.id_cliente === idValue);
          } else {
            console.warn('ClienteListComponent: Consulta de ID inválida:', idQuery);
            tempFilteredList = []; // Se o ID for inválido, não mostra resultados para o critério ID
          }
        }

        // Filtro por Nome
        const nomeQuery = this.searchQueryNome.trim().toLowerCase();
        if (nomeQuery !== '') {
          tempFilteredList = tempFilteredList.filter(cliente =>
            cliente.nome.toLowerCase().includes(nomeQuery)
          );
        }

        // Filtro por CPF
        const cpfQuery = this.searchQueryCpf.trim(); // CPF pode ter formatação, busca exata ou includes dependendo da necessidade
        if (cpfQuery !== '') {
          tempFilteredList = tempFilteredList.filter(cliente =>
            cliente.cpf.includes(cpfQuery) // Usamos includes para busca parcial, pode ser === para exata
          );
        }

        this.filteredClientes = tempFilteredList;
        console.log('ClienteListComponent: Filtro aplicado. Itens resultantes:', this.filteredClientes.length);
      }

      /**
       * Navega para a tela de edição de um cliente.
       * @param cliente O objeto Cliente a ser editado.
       */
      onEdit(cliente: Cliente): void {
        // Redireciona para a rota de edição de cliente
        this.router.navigate(['/cadastros/cliente/editar', cliente.id_cliente]);
      }

      /**
       * Exclui um cliente após confirmação.
       * @param id O ID do cliente a ser excluído.
       */
      onDelete(id: number): void {
        if (confirm(`Tem certeza que deseja excluir o cliente com ID ${id}?`)) {
          this.clienteService.deleteCliente(id).subscribe({
            next: () => {
              console.log(`Cliente com ID ${id} excluído com sucesso.`);
              // Remove o item da lista original e refiltera para atualizar a UI
              this.clientes = this.clientes.filter(c => c.id_cliente !== id);
              this.applyFilter();
            },
            error: (err) => {
              console.error(`Erro ao excluir cliente com ID ${id}:`, err);
              this.error = `Não foi possível excluir o cliente (ID: ${id}).`;
            }
          });
        }
      }
}
