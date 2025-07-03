import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CaixaService } from '../../services/abertura-caixa/caixa.service';

@Component({
  selector: 'app-abertura-caixa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './abertura-caixa.component.html',
  styleUrl: './abertura-caixa.component.scss'
})
export class AberturaCaixaComponent {
  operador: string = 'João da Silva'; // Pega do login futuramente
  valorEntrada: number = 0;

  constructor(private caixaService: CaixaService, private router: Router) { }

  abrirCaixa() {
    if (this.valorEntrada < 0) {
      alert('Valor de entrada não pode ser negativo.');
      return;
    }
    this.caixaService.abrirCaixa(this.operador, this.valorEntrada);
    this.router.navigate(['/pdv']);
  }

}
