import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdvViewComponent } from './pdv-view/pdv-view.component';

const routes: Routes = [
  {
    path: '', // Rota vazia para o módulo PDV (ex: /pdv)
    component: PdvViewComponent, // O componente principal do PDV
    // Se houver sub-rotas futuras dentro do PDV, elas viriam aqui:
    // children: [
    //   { path: 'pagamento', component: PdvPagamentoComponent },
    // ]
  }
];

@NgModule({
  declarations: [], // Componentes standalone não precisam ser declarados aqui
  imports: [
    CommonModule,
    PdvViewComponent, // Importe o componente standalone aqui para que ele possa ser usado nas rotas
    RouterModule.forChild(routes) // Configura as rotas filhas para este módulo
  ],
  exports: [RouterModule] // Exporte o RouterModule para que as rotas sejam visíveis
})
export class PdvModule { }
