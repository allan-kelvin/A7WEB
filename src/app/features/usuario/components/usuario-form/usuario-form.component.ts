import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from '../../../../models/usuario';
import { UsuarioService } from '../../../../services/usuario/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit, OnDestroy {
  usuarioForm: FormGroup;
  isEditMode: boolean = false;
  usuarioId: number | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Inicialização do FormGroup com as validações
    this.usuarioForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]], // CPF com 11 dígitos numéricos
      rg: ['', [Validators.maxLength(15)]],
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      telefone: ['', [Validators.pattern(/^\d{10,11}$/)]], // 10 ou 11 dígitos para telefone/celular
      endereco: ['', [Validators.maxLength(255)]],
      ativo: [true] // Valor padrão para 'ativo'
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.usuarioId = +id; // Converte para número

        this.usuarioService.getUsuarioById(this.usuarioId).subscribe({
          next: (data) => {
            // Preenche o formulário com os dados do usuário
            this.usuarioForm.patchValue({
              cpf: data.cpf,
              rg: data.rg,
              nome: data.nome,
              email: data.email,
              telefone: data.telefone,
              endereco: data.endereco,
              ativo: data.ativo
            });
            console.log('Formulário de usuário preenchido para edição:', data);
          },
          error: (err) => {
            console.error('Erro ao carregar usuário para edição:', err);
            this.router.navigate(['/cadastros/usuario/consultar']); // Volta para a lista se houver erro
          }
        });
      } else {
        this.isEditMode = false;
        this.usuarioId = null;
        this.usuarioForm.reset({ ativo: true }); // Limpa e define 'ativo' como true para novo cadastro
        console.log('Formulário de usuário em modo de cadastro.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    console.log('UsuarioFormComponent: onSubmit() chamado. Formulário válido?', this.usuarioForm.valid);

    if (this.usuarioForm.valid) {
      const formValues = this.usuarioForm.value;
      let payloadToSend: Partial<Usuario>;

      if (this.isEditMode && this.usuarioId) {
        // Para atualização, remove id_usuario do payload
        const { id_usuario, ...restOfValues } = formValues;
        payloadToSend = restOfValues;

        console.log('UsuarioFormComponent: Modo de Edição. Enviando PUT para ID:', this.usuarioId, 'com payload:', payloadToSend);
        this.usuarioService.updateUsuario(this.usuarioId, payloadToSend).subscribe({
          next: (updatedUsuario) => {
            console.log('Usuário atualizado com sucesso:', updatedUsuario);
            this.router.navigate(['/cadastros/usuario/consultar']); // Volta para a lista
          },
          error: (err) => {
            console.error('Erro ao atualizar usuário:', err);
            // Aqui você pode adicionar feedback visual ao usuário
          }
        });
      } else {
        // Para criação, envia todos os valores do formulário
        payloadToSend = formValues;
        console.log('UsuarioFormComponent: Modo de Cadastro. Enviando POST com payload:', payloadToSend);
        this.usuarioService.createUsuario(payloadToSend as Usuario).subscribe({
          next: (newUsuario) => {
            console.log('Usuário criado com sucesso:', newUsuario);
            this.router.navigate(['/cadastros/usuario/consultar']); // Volta para a lista
          },
          error: (err) => {
            console.error('Erro ao criar usuário:', err);
            // Aqui você pode adicionar feedback visual ao usuário
          }
        });
      }
    } else {
      this.usuarioForm.markAllAsTouched(); // Marca todos os campos como "touched" para exibir erros
      console.log('UsuarioFormComponent: Formulário inválido. Não enviando requisição.');
    }
  }

  onCancel(): void {
    console.log('UsuarioFormComponent: Botão Cancelar clicado.');
    this.router.navigate(['/cadastros/usuario/consultar']); // Volta para a lista
  }

}
