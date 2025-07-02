import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = `${environment.apiUrl}/usuario`; // Define a URL base para o endpoint de usuários

  constructor(private http: HttpClient) { }

  /**
   * Obtém todos os usuários do backend.
   * @returns Um Observable de um array de objetos Usuario.
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /**
   * Obtém um usuário específico pelo seu ID.
   * @param id O ID do usuário a ser buscado.
   * @returns Um Observable do objeto Usuario.
   */
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo usuário no backend.
   * @param usuario O objeto Usuario a ser criado.
   * @returns Um Observable do objeto Usuario criado (com o ID gerado pelo backend).
   */
  createUsuario(usuario: Usuario): Observable<Usuario> {
    // Para criação, não enviamos o id_usuario no payload, ele é gerado pelo backend
    const { id_usuario, ...usuarioPayload } = usuario;
    return this.http.post<Usuario>(this.apiUrl, usuarioPayload);
  }

  /**
   * Atualiza um usuário existente no backend.
   * @param id O ID do usuário a ser atualizado.
   * @param usuario Os dados do usuário a serem atualizados (Partial para permitir atualização parcial).
   * @returns Um Observable do objeto Usuario atualizado.
   */
  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    // Para atualização, o ID vai na URL, e o payload contém apenas os campos a serem atualizados
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  /**
   * Exclui um usuário do backend.
   * @param id O ID do usuário a ser excluído.
   * @returns Um Observable vazio (ou com um status de sucesso).
   */
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
