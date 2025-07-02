export interface Estoque {
  id_estoque?: number | null; // PrimaryGeneratedColumn, opcional para criação
  id_produto: number; // Chave estrangeira para Produto
  // produto?: Produto; // Opcional: Se o backend retornar o objeto Produto completo
  produtoNome?: string | null; // Adicionado para exibir o nome do produto na lista/detalhes

  id_loja: number; // Chave estrangeira para Loja
  // loja?: Loja; // Opcional: Se o backend retornar o objeto Loja completo
  lojaNome?: string | null; // Adicionado para exibir o nome da loja na lista/detalhes

  saldo?: number | null; // int, default: 0
  preco?: number | null; // decimal (preço de venda do produto)
  preco_estoque?: number | null; // decimal (preço de custo do estoque = saldo * preco do produto), campo calculado no backend
  curva_venda?: string | null; // varchar(10), 'A', 'B', 'C'
  data_entrada?: Date | null; // date
  ultima_saida?: Date | null; // date
}
