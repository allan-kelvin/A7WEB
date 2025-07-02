import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName: string = 'Allan';
  userEmail: string = 'allan.santos@hotmail.com';

  constructor(private router: Router) { } // <-- INJETE O ROUTER AQUI

  /**
   * Navega para a rota de consulta de produtos.
   */
  navigateToProducts(): void {
    this.router.navigate(['/cadastros/produto/consultar']);
    // Você pode adicionar mais lógica aqui se precisar fechar um menu mobile, etc.
  }

  /**
   * Navega para a rota de consulta de clientes.
   */
  navigateToClients(): void {
    this.router.navigate(['/cadastros/cliente/consultar']);
  }

  // Você pode adicionar outros métodos navigateTo para os demais atalhos se desejar.
  navigateToPdv(): void {
    console.log('Navegar para PDV (ainda não implementado)');
    this.router.navigate(['/pdv']);
  }

  navigateToRecebimento(): void {
    console.log('Navegar para Recebimento (ainda não implementado)');
  }

  navigateToEntrada(): void {
    console.log('Navegar para Entrada (ainda não implementado)');
  }

  navigateToSaida(): void {
    console.log('Navegar para Saída (ainda não implementado)');
  }

  navigateToRelatorios(): void {
    console.log('Navegar para Relatórios (ainda não implementado)');
  }
}
