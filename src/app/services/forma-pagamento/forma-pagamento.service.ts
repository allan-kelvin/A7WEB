import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { FormaPagamento } from '../../models/forma-pagamento.model';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService {
  private apiUrl = `${environment.apiUrl}/formas-pagamento`;

  constructor(private http: HttpClient) { }

   /**
   * Obtém todas as formas de pagamento do backend.
   * @returns Um Observable de um array de FormaPagamento.
   */
  getFormasPagamento(): Observable<FormaPagamento[]> {
    return this.http.get<FormaPagamento[]>(this.apiUrl);
  }

  /**
   * Obtém uma forma de pagamento específica pelo ID.
   * @param id O ID da forma de pagamento.
   * @returns Um Observable da FormaPagamento.
   */
  getFormaPagamentoById(id: number): Observable<FormaPagamento> {
    return this.http.get<FormaPagamento>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria uma nova forma de pagamento no backend.
   * @param formaPagamento Os dados da nova forma de pagamento (sem o ID).
   * @returns Um Observable da FormaPagamento criada (com o ID gerado).
   */
  createFormaPagamento(formaPagamento: FormaPagamento): Observable<FormaPagamento> {
    return this.http.post<FormaPagamento>(this.apiUrl, formaPagamento);
  }

  /**
   * Atualiza uma forma de pagamento existente no backend.
   * @param id O ID da forma de pagamento a ser atualizada.
   * @param formaPagamento Os dados atualizados da forma de pagamento.
   * @returns Um Observable da FormaPagamento atualizada.
   */
  updateFormaPagamento(id: number, formaPagamento: FormaPagamento): Observable<FormaPagamento> {
    return this.http.put<FormaPagamento>(`${this.apiUrl}/${id}`, formaPagamento);
  }

  /**
   * Exclui uma forma de pagamento do backend.
   * @param id O ID da forma de pagamento a ser excluída.
   * @returns Um Observable vazio (ou com alguma resposta de sucesso/erro).
   */
  deleteFormaPagamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
