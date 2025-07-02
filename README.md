# Frontend Angular - Sistema A7Web (PDV)

Este `README.md` documenta a estrutura e as funcionalidades do frontend Angular do sistema A7Web, com foco especial no módulo de Ponto de Venda (PDV) desenvolvido.

## Visão Geral do Projeto

O frontend Angular é a interface do usuário para o sistema A7Web, permitindo a interação com o backend NestJS. Recentemente, focamos na implementação do módulo de PDV, que permite a busca de produtos, adição de itens à venda, cálculo de totais e preparação para a finalização da venda.

## Arquitetura de Pastas (Frontend `src/app`)

A arquitetura de pastas segue uma estrutura modular, organizando o código por funcionalidades (features) e responsabilidades (core, shared, models, services).

``` bash
src/
├── app/
│   ├── app.config.ts             # Configuração principal da aplicação (para standalone)
│   ├── app.component.ts/.html/.scss # Componente raiz da aplicação
│   ├── app.routes.ts             # Definição das rotas principais da aplicação
│   │
│   ├── core/                     # Módulos e serviços globais da aplicação (layout, autenticação, etc.)
│   │   ├── layout/
│   │   │   ├── layout.component.ts/.html/.scss # Componente de layout principal
│   │   │   └── ...
│   │   └── header/
│   │       └── header.component.ts/.html/.scss # Componente do cabeçalho com atalhos
│   │
│   ├── features/                 # Módulos de funcionalidades específicas
│   │   ├── dashboard/            # Ex: Módulo do Dashboard
│   │   │   └── ...
│   │   ├── cliente/              # Módulo de Clientes
│   │   │   ├── components/       # Componentes reutilizáveis do módulo (ex: formulários)
│   │   │   ├── pages/            # Páginas principais do módulo (ex: lista, detalhes)
│   │   │   ├── cliente-view/     # Componente "view" que agrupa páginas/componentes
│   │   │   └── ...
│   │   ├── estoque/              # Módulo de Estoque
│   │   │   └── ...
│   │   ├── forma-pagamento/      # Módulo de Formas de Pagamento
│   │   │   └── ...
│   │   ├── produto/              # Módulo de Produtos
│   │   │   └── ...
│   │   ├── usuario/              # Módulo de Usuários e Permissões
│   │   │   └── ...
│   │   ├── vendedor/             # Módulo de Vendedores
│   │   │   └── ...
│   │   └── pdv/                  # <--- MÓDULO DO PDV (Ponto de Venda)
│   │       ├── components/       # Componentes menores e reutilizáveis do PDV
│   │       │   ├── pdv-itens-list/ # Lista de itens da venda
│   │       │   │   ├── pdv-itens-list.component.ts
│   │       │   │   ├── pdv-itens-list.component.html
│   │       │   │   └── pdv-itens-list.component.scss
│   │       │   └── pdv-produto-search/ # Componente de busca de produtos
│   │       │       ├── pdv-produto-search.component.ts
│   │       │       ├── pdv-produto-search.component.html
│   │       │       └── pdv-produto-search.component.scss
│   │       ├── pdv-view/         # Componente principal da tela do PDV
│   │       │   ├── pdv-view.component.ts
│   │       │   ├── pdv-view.component.html
│   │       │   └── pdv-view.component.scss
│   │       └── pdv.module.ts     # Módulo Angular para o PDV (lazy-loaded)
│   │
│   ├── models/                   # Definições de interfaces/modelos de dados (ex: Produto, PdvItem)
│   │   ├── produto.model.ts      # Interface para a entidade Produto
│   │   └── pdv-item.model.ts     # Interface para um item de venda no PDV (Produto + quantidade/subtotal)
│   │
│   └── services/                 # Serviços para comunicação com o backend (APIs)
│       └── produto/
│           └── produto.service.ts # Serviço para operações com produtos
│
└── main.ts                     # Ponto de entrada da aplicação Angular
```


## Módulos e Componentes Chave do PDV

### `main.ts`
* **Propósito:** Ponto de entrada da aplicação.
* **Configuração Importante:** Contém o registro dos dados de localização para o português (`pt`) usando `registerLocaleData(localePt, 'pt');`. Isso é essencial para que os pipes de formatação de número (`number`, `currency`) funcionem corretamente com vírgulas e moedas brasileiras, evitando o erro `NG0701`.

### `app.routes.ts`
* **Propósito:** Define as rotas de alto nível da aplicação.
* **Configuração Importante:** A rota para o PDV (`/pdv`) é configurada para carregar o `PdvModule` de forma **lazy-loaded**. Isso significa que o código do módulo PDV só é baixado e processado pelo navegador quando o usuário realmente navega para essa rota, otimizando o carregamento inicial da aplicação.
    ```typescript
    {
      path: 'pdv',
      loadChildren: () => import('./features/pdv/pdv.module').then(m => m.PdvModule)
    },
    ```

### `pdv.module.ts`
* **Propósito:** Módulo Angular que agrupa e organiza todos os componentes e serviços relacionados ao PDV.
* **Configuração Importante:** Importa o `PdvViewComponent` (como standalone) e configura as rotas filhas (`RouterModule.forChild`) para o módulo PDV.

### `pdv-view.component.ts` / `.html` / `.scss`
* **Propósito:** É o componente principal da tela do PDV. Ele atua como um "container" para os outros sub-componentes (busca de produto, lista de itens).
* **`pdv-view.component.ts`:**
    * Gerencia a lista de `itensVenda` (do tipo `PdvItem[]`).
    * Controla o `totalVenda`.
    * Mantém `currentQuantity` para a quantidade do próximo item a ser adicionado.
    * Recebe o `produtoAdicionado` do `PdvProdutoSearchComponent` e adiciona/atualiza o `PdvItem` na lista.
    * Recalcula o `totalVenda` dinamicamente.
    * Gerencia `selectedProductForDisplay` para exibir o preço unitário do produto selecionado na busca.
* **`pdv-view.component.html`:**
    * Estrutura o layout visual do PDV com base na imagem fornecida.
    * Integra `app-pdv-produto-search` e `app-pdv-itens-list`.
    * Exibe o `totalVenda` formatado.
    * Vincula o `currentQuantity` ao input de quantidade.
* **`pdv-view.component.scss`:** Define os estilos visuais para o layout geral do PDV, incluindo responsividade.

### `pdv-produto-search.component.ts` / `.html` / `.scss`
* **Propósito:** Componente responsável por permitir a busca de produtos.
* **`pdv-produto-search.component.ts`:**
    * Utiliza `debounceTime` e `distinctUntilChanged` para otimizar a busca (evitar muitas requisições ao digitar).
    * Filtra produtos por nome, ID ou código de barras (atualmente simulando no frontend, mas idealmente seria uma chamada ao backend).
    * Emite `produtoAdicionado` quando um produto é selecionado (via Enter ou duplo clique).
    * Emite `produtoSelecionadoParaDisplay` para que o `PdvViewComponent` possa mostrar o preço unitário do item selecionado na busca.
* **`pdv-produto-search.component.html`:**
    * Contém o `input` para a busca de produtos.
    * Exibe os resultados da busca em uma lista.
    * Permite selecionar um produto clicando ou adicioná-lo à venda pressionando **Enter** no input ou **duplo clique** no item da lista de resultados.
* **`pdv-produto-search.component.scss`:** Define os estilos para o campo de busca e a lista de resultados.

### `pdv-itens-list.component.ts` / `.html` / `.scss`
* **Propósito:** Componente responsável por exibir a lista de itens que foram adicionados à venda.
* **`pdv-itens-list.component.ts`:**
    * Recebe um array de `PdvItem[]` como `@Input()`.
* **`pdv-itens-list.component.html`:**
    * Renderiza os `PdvItem`s em uma tabela, mostrando quantidade, nome do produto, valor unitário e valor total do item (`subtotal`).
* **`pdv-itens-list.component.scss`:** Define os estilos para a tabela de itens da venda.

### `pdv-item.model.ts`
* **Propósito:** Define a interface para um item de venda no PDV.
* **Conteúdo:** Estende a interface `Produto` e adiciona as propriedades `quantidade` e `subtotal`, que são específicas do contexto da venda.

## Comandos Utilizados

Aqui estão os principais comandos da CLI do Angular e do Node.js/NPM que utilizamos durante o desenvolvimento do PDV:

### Configuração e Instalação de Dependências
* `npm install` ou `npm i`: Instala todas as dependências listadas no `package.json`. Essencial após clonar o projeto ou fazer alterações nas dependências.
* `npm install @nestjs/mapped-types`: Instala o pacote para usar `PartialType` em DTOs.
* `npm install -D ts-node tsconfig-paths`: Instala dependências de desenvolvimento para que o TypeORM CLI possa executar arquivos TypeScript.
* `npm cache clean --force`: Limpa o cache do npm. Útil para resolver problemas de dependência.
* `rm -rf node_modules dist` (Linux/macOS) ou `rd /s /q node_modules dist` (Windows): Remove as pastas de dependências e de build. Usado em conjunto com `npm install` e `npm run build` para uma "limpeza profunda".

### Geração de Módulos e Componentes (Angular CLI)
* `ng generate module features/pdv --route pdv --module app.routes`: Cria o módulo `pdv` dentro de `features`, configura uma rota `pdv` e a adiciona ao `app.routes.ts`.
* `ng generate component features/pdv/pdv-view --standalone`: Cria o componente `pdv-view` como um componente `standalone`.
* `ng generate component features/pdv/components/pdv-itens-list --standalone`: Cria o componente `pdv-itens-list` como um componente `standalone` dentro da pasta `components` do PDV.
* `ng generate component features/pdv/components/pdv-produto-search --standalone`: Cria o componente `pdv-produto-search` como um componente `standalone` dentro da pasta `components` do PDV.

### Execução do Projeto Angular
* `ng serve`: Inicia o servidor de desenvolvimento do Angular, compilando e servindo a aplicação. As alterações no código são automaticamente recarregadas.

### Comandos do Backend (TypeORM Migrations - via `package.json` scripts)
* `npm run typeorm`: Comando base para o TypeORM CLI, configurado para usar `ts-node` e o `ormconfig.ts`.
* `npm run migration:generate src/migrations/NomeDaSuaMigration`: Gera um novo arquivo de migração com as alterações de esquema detectadas nas entidades.
* `npm run migration:run`: Executa as migrações pendentes no banco de dados.
* `npm run migration:revert`: Reverte a última migração aplicada.

## Como Rodar o Projeto (Frontend)

1.  **Certifique-se de que o backend NestJS está rodando** e acessível.
2.  **Navegue até a pasta raiz do frontend** no seu terminal.
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    ng serve
    ```
5.  **Abra seu navegador** e acesse `http://localhost:4200` (ou a porta que o `ng serve` indicar).

``` bash
ng generate service services/vendedor
``` 
