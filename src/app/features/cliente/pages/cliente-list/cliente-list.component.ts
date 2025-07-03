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
  searchQueryNome: string = '';
  searchQueryCpf: string = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.isLoading = true;
    this.error = null;
    this.clientes = [];
    this.filteredClientes = [];
    console.log('ClienteListComponent: Iniciando carregamento de clientes...');

    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log('ClienteListComponent: Dados recebidos do backend:', data);
        this.clientes = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('ClienteListComponent: Erro ao buscar clientes:', err);
        this.error = 'Não foi possível carregar os clientes. Verifique o console para mais detalhes.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    console.log('ClienteListComponent: applyFilter chamado. ID:', this.searchQueryId, 'Nome:', this.searchQueryNome, 'CPF:', this.searchQueryCpf);

    let tempFilteredList = [...this.clientes];

    const idQuery = String(this.searchQueryId).trim();
    if (idQuery !== '') {
      const idValue = Number(idQuery);
      if (!isNaN(idValue)) {
        tempFilteredList = tempFilteredList.filter(cliente => cliente.id_cliente === idValue);
      } else {
        console.warn('ClienteListComponent: Consulta de ID inválida:', idQuery);
        tempFilteredList = [];
      }
    }

    const nomeQuery = this.searchQueryNome.trim().toLowerCase();
    if (nomeQuery !== '') {
      tempFilteredList = tempFilteredList.filter(cliente =>
        cliente.nome.toLowerCase().includes(nomeQuery)
      );
    }

    const cpfQuery = this.searchQueryCpf.trim();
    if (cpfQuery !== '') {
      tempFilteredList = tempFilteredList.filter(cliente =>
        cliente.cpf.includes(cpfQuery)
      );
    }

    this.filteredClientes = tempFilteredList;
    console.log('ClienteListComponent: Filtro aplicado. Itens resultantes:', this.filteredClientes.length);
  }

  onEdit(cliente: Cliente): void {
    this.router.navigate(['/cadastros/cliente/editar', cliente.id_cliente]);
  }

  onDelete(id: number): void {
    if (confirm(`Tem certeza que deseja excluir o cliente com ID ${id}?`)) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          console.log(`Cliente com ID ${id} excluído com sucesso.`);
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

  navigateToCadastro(): void {
    this.router.navigate(['/cadastros/cliente/cadastrar']); // Ajuste esta rota conforme sua definição real
  }
}
