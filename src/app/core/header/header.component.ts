import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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

  @Output() toggleSidebarEvent = new EventEmitter<void>(); // Novo EventEmitter

  constructor(private router: Router) { }

  navigateToProducts(): void {
    this.router.navigate(['/cadastros/produto/consultar']);
  }

  navigateToClients(): void {
    this.router.navigate(['/cadastros/cliente/consultar']);
  }

  navigateToPdv(): void {
    console.log('Navegar para PDV (ainda não implementado)');
    this.router.navigate(['/pdv/abertura']);
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
