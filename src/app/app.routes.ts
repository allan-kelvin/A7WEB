import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

// Componentes de formas de pagamento existentes
import { FormaPagamentoFormComponent } from './features/forma-pagamento/components/forma-pagamento-form/forma-pagamento-form.component';
import { FormaPagamentoViewComponent } from './features/forma-pagamento/forma-pagamento-view/forma-pagamento-view.component';
import { FormaPagamentoListComponent } from './features/forma-pagamento/pages/forma-pagamento-list/forma-pagamento-list.component';

// Componentes de clientes existentes
import { ClienteViewComponent } from './features/cliente/cliente-view/cliente-view.component';
import { ClienteFormComponent } from './features/cliente/components/cliente-form/cliente-form.component';
import { ClienteListComponent } from './features/cliente/pages/cliente-list/cliente-list.component';

// Componentes de produtos
import { ProdutoFormComponent } from './features/produto/components/produto-form/produto-form.component';
import { ProdutoListComponent } from './features/produto/pages/produto-list/produto-list.component';
import { ProdutoViewComponent } from './features/produto/produto-view/produto-view.component';

// Componentes de vendedores
import { VendedorFormComponent } from './features/vendedor/components/vendedor-form/vendedor-form.component';
import { VendedorListComponent } from './features/vendedor/pages/vendedor-list/vendedor-list.component';
import { VendedorViewComponent } from './features/vendedor/vendedor-view/vendedor-view.component';

// Componentes de permissões
import { PermissaoFormComponent } from './features/usuario/components/permissao-form/permissao-form.component';
import { PermissaoListComponent } from './features/usuario/pages/permissao-list/permissao-list.component';
import { PermissaoViewComponent } from './features/usuario/permissao-view/permissao-view.component';

// Componentes de usuários
import { UsuarioFormComponent } from './features/usuario/components/usuario-form/usuario-form.component';
import { UsuarioListComponent } from './features/usuario/pages/usuario-list/usuario-list.component';
import { UsuarioViewComponent } from './features/usuario/usuario-view/usuario-view.component';

// Componentes de estoque
import { EstoqueViewComponent } from './features/estoque/estoque-view/estoque-view.component';
import { EstoqueListComponent } from './features/estoque/pages/estoque-list/estoque-list.component';

// REMOVIDO: import { PdvViewComponent } from './features/pdv/pdv-view/pdv-view.component'; // Não é mais importado diretamente

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Rota para o Dashboard
      { path: 'dashboard', component: DashboardComponent },

      // Rotas para o Módulo Financeiro
      {
        path: 'financeiro',
        children: [
          { path: '', redirectTo: 'formas-pagamento', pathMatch: 'full' },
          {
            path: 'formas-pagamento',
            component: FormaPagamentoViewComponent,
            children: [
              { path: '', redirectTo: 'consultar', pathMatch: 'full' },
              { path: 'consultar', component: FormaPagamentoListComponent },
              { path: 'cadastrar', component: FormaPagamentoFormComponent }
              // { path: 'editar/:id', component: FormaPagamentoFormComponent } // Já existe
            ]
          }
        ]
      },

      // Rotas para Vendas (placeholder)
      {
        path: 'vendas', children: [
          { path: 'registrar', component: DashboardComponent },
          { path: 'historico', component: DashboardComponent },
          { path: '', redirectTo: 'registrar', pathMatch: 'full' }
        ]
      },

      // Rota para PDV com Lazy Loading
      {
        path: 'pdv',
        loadChildren: () => import('./features/pdv/pdv.module').then(m => m.PdvModule) // <-- Lazy Loading do PdvModule
      },

      // Rotas para Estoque
      {
        path: 'estoque',
        children: [
          { path: '', redirectTo: 'consulta', pathMatch: 'full' },
          {
            path: 'consulta',
            component: EstoqueViewComponent,
            children: [
              { path: '', component: EstoqueListComponent }
            ]
          }
        ]
      },

      // Rotas para Cadastros
      {
        path: 'cadastros',
        children: [
          { path: '', redirectTo: 'produto/consultar', pathMatch: 'full' },

          {
            path: 'produto',
            component: ProdutoViewComponent,
            children: [
              { path: '', redirectTo: 'consultar', pathMatch: 'full' },
              { path: 'consultar', component: ProdutoListComponent },
              { path: 'cadastrar', component: ProdutoFormComponent },
              { path: 'editar/:id', component: ProdutoFormComponent }
            ]
          },
          {
            path: 'cliente',
            component: ClienteViewComponent,
            children: [
              { path: '', redirectTo: 'consultar', pathMatch: 'full' },
              { path: 'consultar', component: ClienteListComponent },
              { path: 'cadastrar', component: ClienteFormComponent },
              { path: 'editar/:id', component: ClienteFormComponent }
            ]
          },
          {
            path: 'vendedor',
            component: VendedorViewComponent,
            children: [
              { path: '', redirectTo: 'consultar', pathMatch: 'full' },
              { path: 'consultar', component: VendedorListComponent },
              { path: 'cadastrar', component: VendedorFormComponent },
              { path: 'editar/:id', component: VendedorFormComponent }
            ]
          },
          {
            path: 'usuario',
            component: UsuarioViewComponent,
            children: [
              { path: '', redirectTo: 'consultar', pathMatch: 'full' },
              { path: 'consultar', component: UsuarioListComponent },
              { path: 'cadastrar', component: UsuarioFormComponent },
              { path: 'editar/:id', component: UsuarioFormComponent }
            ]
          },
          {
            path: 'permissoes',
            component: PermissaoViewComponent,
            children: [
              { path: '', redirectTo: 'consultar', pathMatch: 'full' },
              { path: 'consultar', component: PermissaoListComponent },
              { path: 'cadastrar', component: PermissaoFormComponent },
              { path: 'editar/:id', component: PermissaoFormComponent }
            ]
          }
        ]
      },

      // Outras rotas de alto nível (NF-e, Contábil, Relatórios)
      { path: 'nfe', component: DashboardComponent },
      { path: 'contabil', component: DashboardComponent },
      { path: 'relatorios', component: DashboardComponent },
    ]
  },
  { path: '**', component: DashboardComponent }
];
