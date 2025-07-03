import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaixaService {
  private status: 'ABERTO' | 'FECHADO' = 'FECHADO';
  private operador: string = '';
  private valorEntrada: number = 0;

  abrirCaixa(operador: string, valor: number): void {
    this.operador = operador;
    this.valorEntrada = valor;
    this.status = 'ABERTO';
    console.log('Caixa aberto:', { operador, valor });
  }

  fecharCaixa(): void {
    this.status = 'FECHADO';
    this.operador = '';
    this.valorEntrada = 0;
    console.log('Caixa fechado');
  }

  getStatus(): 'ABERTO' | 'FECHADO' {
    return this.status;
  }

  getOperador(): string {
    return this.operador;
  }

  getValorEntrada(): number {
    return this.valorEntrada;
  }

  isCaixaAberto(): boolean {
    return this.status === 'ABERTO';
  }
}
