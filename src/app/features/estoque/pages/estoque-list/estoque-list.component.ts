import { CommonModule, DatePipe } from '@angular/common'; // Importe DatePipe
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Necessário para ngModel
import { Router } from '@angular/router';
import { Estoque } from '../../../../models/estoque';
import { EstoqueService } from '../../../../services/estoque.service';
import { ProdutoService } from '../../../../services/produtos/produto.service';

@Component({
  selector: 'app-estoque-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './estoque-list.component.html',
  styleUrl: './estoque-list.component.scss'
})
export class EstoqueListComponent implements OnInit {
  estoques: Estoque[] = []; // Lista original completa vinda do backend
  filteredEstoques: Estoque[] = []; // Lista filtrada exibida na UI
  isLoading: boolean = true;
  error: string | null = null;

  // Propriedades para os campos de busca (conforme o Figma)
  searchQueryProduto: string = ''; // Busca por nome do produto
  searchQueryLoja: string = ''; // Busca por nome da loja
  searchQueryCurvaVenda: string | null = null; // Select para Curva Venda
  searchQueryDataEntrada: string = ''; // Input de data para Data Entrada
  searchQueryUltimaSaida: string = ''; // Input de data para Última Saída

  curvaVendaOptions: string[] = ['A', 'B', 'C']; // Opções para o select de Curva Venda

  // Mapas para armazenar nomes de produtos e lojas para exibição
  private produtoNames: { [key: number]: string } = {};
  private lojaNames: { [key: number]: string } = {};

  constructor(
    private estoqueService: EstoqueService,
    private produtoService: ProdutoService, // Injeta ProdutoService
    private router: Router, // Injeta Router
    private datePipe: DatePipe // Injeta DatePipe
    // private lojaService: LojaService // Injeta LojaService, se existir
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Carrega todos os dados necessários (estoques, produtos, lojas)
   * e então aplica o filtro inicial.
   */
  loadData(): void {
    this.isLoading = true;
    this.error = null;
    this.estoques = [];
    this.filteredEstoques = [];
    this.produtoNames = {};
    this.lojaNames = {};

    console.log('EstoqueListComponent: Iniciando carregamento de dados...');

    // Carrega produtos para mapear IDs para nomes
    this.produtoService.getProdutos().subscribe({
      next: (produtosData) => {
        produtosData.forEach(p => {
          if (p.id_produto && p.nome) {
            this.produtoNames[p.id_produto] = p.nome;
          }
        });
        console.log('EstoqueListComponent: Nomes de produtos carregados.', this.produtoNames);
        this.loadEstoques(); // Carrega estoques após carregar produtos
      },
      error: (err) => {
        console.error('EstoqueListComponent: Erro ao carregar produtos para mapeamento:', err);
        this.error = 'Não foi possível carregar os produtos. A lista de estoque pode estar incompleta.';
        this.isLoading = false;
      }
    });

    // TODO: Implementar carregamento de lojas de forma similar
    // this.lojaService.getLojas().subscribe({
    //   next: (lojasData) => {
    //     lojasData.forEach(l => {
    //       if (l.id_loja && l.nome) {
    //         this.lojaNames[l.id_loja] = l.nome;
    //       }
    //     });
    //     console.log('EstoqueListComponent: Nomes de lojas carregados.', this.lojaNames);
    //   },
    //   error: (err) => {
    //     console.error('EstoqueListComponent: Erro ao carregar lojas para mapeamento:', err);
    //     this.error = 'Não foi possível carregar as lojas. A lista de estoque pode estar incompleta.';
    //   }
    // });
  }

  /**
   * Carrega a lista completa de estoques do backend.
   */
  loadEstoques(): void {
    this.estoqueService.getEstoques().subscribe({
      next: (data) => {
        console.log('EstoqueListComponent: Dados de estoque recebidos do backend:', data);
        this.estoques = data.map(item => ({
          ...item,
          // Adiciona os nomes de produto e loja ao objeto de estoque para exibição
          produtoNome: item.id_produto ? this.produtoNames[item.id_produto] : 'Produto Desconhecido',
          // lojaNome: item.id_loja ? this.lojaNames[item.id_loja] : 'Loja Desconhecida', // Descomente quando LojaService estiver pronto
          // Converte strings de data para objetos Date, se necessário, ou formata diretamente no HTML
          data_entrada: item.data_entrada ? new Date(item.data_entrada) : null,
          ultima_saida: item.ultima_saida ? new Date(item.ultima_saida) : null
        }));
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('EstoqueListComponent: Erro ao buscar estoques:', err);
        this.error = 'Não foi possível carregar os registros de estoque. Verifique o console para mais detalhes.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica os filtros de busca na lista de estoques.
   */
  applyFilter(): void {
    console.log('EstoqueListComponent: applyFilter chamado. Produto:', this.searchQueryProduto, 'Loja:', this.searchQueryLoja, 'Curva:', this.searchQueryCurvaVenda, 'Entrada:', this.searchQueryDataEntrada, 'Saída:', this.searchQueryUltimaSaida);

    let tempFilteredList = [...this.estoques];

    const produtoQuery = this.searchQueryProduto.trim().toLowerCase();
    if (produtoQuery !== '') {
      tempFilteredList = tempFilteredList.filter(item =>
        item.produtoNome?.toLowerCase().includes(produtoQuery)
      );
    }

    const lojaQuery = this.searchQueryLoja.trim().toLowerCase();
    if (lojaQuery !== '') {
      tempFilteredList = tempFilteredList.filter(item =>
        item.lojaNome?.toLowerCase().includes(lojaQuery)
      );
    }

    if (this.searchQueryCurvaVenda && this.searchQueryCurvaVenda !== 'null') { // 'null' é o valor do option disabled selected
      tempFilteredList = tempFilteredList.filter(item =>
        item.curva_venda === this.searchQueryCurvaVenda
      );
    }

    const dataEntradaQuery = this.searchQueryDataEntrada.trim();
    if (dataEntradaQuery !== '') {
      tempFilteredList = tempFilteredList.filter(item =>
        this.datePipe.transform(item.data_entrada, 'yyyy-MM-dd') === dataEntradaQuery
      );
    }

    const ultimaSaidaQuery = this.searchQueryUltimaSaida.trim();
    if (ultimaSaidaQuery !== '') {
      tempFilteredList = tempFilteredList.filter(item =>
        this.datePipe.transform(item.ultima_saida, 'yyyy-MM-dd') === ultimaSaidaQuery
      );
    }

    this.filteredEstoques = tempFilteredList;
    console.log('EstoqueListComponent: Filtro aplicado. Itens resultantes:', this.filteredEstoques.length);
  }

  /**
   * Calcula o valor total do estoque para um item.
   * @param saldo Saldo do item.
   * @param precoCusto Preço de custo do item (preco_estoque).
   * @returns O valor total do estoque para este item.
   */
  calculateValorEstoque(saldo: number | null | undefined, precoCusto: number | null | undefined): number {
    const s = saldo ?? 0;
    const pc = precoCusto ?? 0;
    return s * pc;
  }

}
