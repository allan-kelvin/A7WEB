import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Mantenha este import para ngModel
import { Router } from '@angular/router';
import { FormaPagamento } from '../../../../models/forma-pagamento.model';
import { FormaPagamentoService } from '../../../../services/forma-pagamento/forma-pagamento.service';

@Component({
  selector: 'app-forma-pagamento-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // Mantenha FormsModule aqui
  templateUrl: './forma-pagamento-list.component.html',
  styleUrl: './forma-pagamento-list.component.scss'
})
export class FormaPagamentoListComponent implements OnInit {
  formasPagamento: FormaPagamento[] = []; // Lista original completa vinda do backend
  filteredFormasPagamento: FormaPagamento[] = []; // Lista filtrada exibida na UI
  isLoading: boolean = true;
  error: string | null = null;
  searchQueryId: string = ''; // Campo de busca por ID
  searchQueryDescription: string = ''; // Campo de busca por Descrição

  constructor(
    private formaPagamentoService: FormaPagamentoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFormasPagamento();
  }

  loadFormasPagamento(): void {
    this.isLoading = true;
    this.error = null;
    this.formasPagamento = []; // Garante que a lista original esteja vazia antes de carregar
    this.filteredFormasPagamento = []; // Esvazia também a lista filtrada enquanto carrega
    console.log('FormaPagamentoListComponent: Iniciando carregamento de formas de pagamento...'); // LOG

    this.formaPagamentoService.getFormasPagamento().subscribe({
      next: (data) => {
        console.log('FormaPagamentoListComponent: Dados recebidos do backend:', data); // LOG: Verifique o que o backend retornou
        this.formasPagamento = data; // Armazena a lista completa
        console.log('FormaPagamentoListComponent: formasPagamento após atribuição:', this.formasPagamento); // LOG
        this.applyFilter(); // Aplica o filtro inicial (deve mostrar tudo se os campos de busca estiverem vazios)
        console.log('FormaPagamentoListComponent: filteredFormasPagamento após filtro inicial:', this.filteredFormasPagamento); // LOG
        this.isLoading = false;
      },
      error: (err) => {
        console.error('FormaPagamentoListComponent: Erro ao buscar formas de pagamento:', err); // LOG de Erro
        this.error = 'Não foi possível carregar as formas de pagamento. Verifique o console para mais detalhes.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    console.log('FormaPagamentoListComponent: applyFilter chamado. ID:', this.searchQueryId, 'Desc:', this.searchQueryDescription); // LOG

    let tempFilteredList = [...this.formasPagamento]; // Sempre começa com a lista completa de itens

    // Correção: Garante que searchQueryId seja uma string antes de chamar trim()
    // Trata null/undefined diretamente para que se tornem string vazia para o trim()
    const idQuery = (this.searchQueryId === null || this.searchQueryId === undefined) ? '' : String(this.searchQueryId).trim();
    const descriptionQuery = this.searchQueryDescription.trim().toLowerCase();

    // Aplica filtro por ID
    // O filtro por ID só será aplicado se o campo de busca de ID não estiver vazio.
    // Se estiver vazio, ele passa pela lista sem filtrar por ID.
    if (idQuery !== '') { // Verifica se há algo digitado no campo ID
      const idValue = Number(idQuery);
      if (!isNaN(idValue)) { // Verifica se o valor digitado é um número válido
        tempFilteredList = tempFilteredList.filter(forma => forma.id_forma_pagamento === idValue);
      } else {
        // Se o valor digitado não é um número válido (ex: "abc"), e o campo não está vazio,
        // isso significa que nenhum ID pode corresponder. A lista resultante para este critério será vazia.
        console.warn('FormaPagamentoListComponent: Consulta de ID inválida:', idQuery); // LOG de aviso
        tempFilteredList = []; // Filtra tudo, pois não há ID válido para corresponder
      }
    }

    // Aplica filtro por Descrição, SOMENTE se descriptionQuery não estiver vazio
    if (descriptionQuery !== '') { // Verifica se há algo digitado no campo Descrição
      tempFilteredList = tempFilteredList.filter(forma =>
        forma.descricao.toLowerCase().includes(descriptionQuery)
      );
    }

    this.filteredFormasPagamento = tempFilteredList;
    console.log('FormaPagamentoListComponent: Filtro aplicado. Itens resultantes:', this.filteredFormasPagamento.length); // LOG
  }

  onEdit(formaPagamento: FormaPagamento): void {
    this.router.navigate(['/formas-pagamento/editar', formaPagamento.id_forma_pagamento]);
  }

  onDelete(id: number): void {
    if (confirm(`Tem certeza que deseja excluir a forma de pagamento com ID ${id}?`)) {
      this.formaPagamentoService.deleteFormaPagamento(id).subscribe({
        next: () => {
          console.log(`Forma de pagamento com ID ${id} excluída com sucesso.`);
          // Remove o item da lista original e refiltera
          this.formasPagamento = this.formasPagamento.filter(f => f.id_forma_pagamento !== id);
          this.applyFilter(); // Aplica o filtro novamente para atualizar a lista exibida
        },
        error: (err) => {
          console.error(`Erro ao excluir forma de pagamento com ID ${id}:`, err);
          this.error = `Não foi possível excluir a forma de pagamento (ID: ${id}).`;
        }
      });
    }
  }
}
