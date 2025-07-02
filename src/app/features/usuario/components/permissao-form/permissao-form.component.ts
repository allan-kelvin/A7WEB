import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Permissao } from '../../../../models/permissao';
import { PermissaoService } from '../../../../services/permissao/permissao.service';

@Component({
  selector: 'app-permissao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './permissao-form.component.html',
  styleUrl: './permissao-form.component.scss'
})
export class PermissaoFormComponent implements OnInit, OnDestroy {

  permissaoForm: FormGroup;
  isEditMode: boolean = false;
  permissaoId: number | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private permissaoService: PermissaoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Inicialização do FormGroup com as validações
    this.permissaoForm = this.fb.group({
      id_usuario: [null, [Validators.required, Validators.min(1)]], // ID do Usuário é obrigatório e deve ser um número
      criar: [false], // Default false
      editar: [false], // Default false
      excluir: [false], // Default false
      admin: [false] // Default false
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.permissaoId = +id; // Converte para número

        this.permissaoService.getPermissaoById(this.permissaoId).subscribe({
          next: (data) => {
            // Preenche o formulário com os dados da permissão
            this.permissaoForm.patchValue({
              id_usuario: data.id_usuario,
              criar: data.criar,
              editar: data.editar,
              excluir: data.excluir,
              admin: data.admin
            });
            console.log('Formulário de permissão preenchido para edição:', data);
          },
          error: (err) => {
            console.error('Erro ao carregar permissão para edição:', err);
            this.router.navigate(['/cadastros/usuario/permissoes/consultar']); // Volta para a lista se houver erro
          }
        });
      } else {
        this.isEditMode = false;
        this.permissaoId = null;
        this.permissaoForm.reset({ id_usuario: null, criar: false, editar: false, excluir: false, admin: false }); // Limpa e define defaults
        console.log('Formulário de permissão em modo de cadastro.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    console.log('PermissaoFormComponent: onSubmit() chamado. Formulário válido?', this.permissaoForm.valid);

    if (this.permissaoForm.valid) {
      const formValues = this.permissaoForm.value;
      let payloadToSend: Partial<Permissao>;

      if (this.isEditMode && this.permissaoId) {
        // Para atualização, remove id_permissao do payload
        const { id_permissao, ...restOfValues } = formValues;
        payloadToSend = restOfValues;

        console.log('PermissaoFormComponent: Modo de Edição. Enviando PUT para ID:', this.permissaoId, 'com payload:', payloadToSend);
        this.permissaoService.updatePermissao(this.permissaoId, payloadToSend).subscribe({
          next: (updatedPermissao) => {
            console.log('Permissão atualizada com sucesso:', updatedPermissao);
            this.router.navigate(['/cadastros/usuario/permissoes/consultar']); // Volta para a lista
          },
          error: (err) => {
            console.error('Erro ao atualizar permissão:', err);
            // Aqui você pode adicionar feedback visual ao usuário
          }
        });
      } else {
        // Para criação, envia todos os valores do formulário
        payloadToSend = formValues;
        console.log('PermissaoFormComponent: Modo de Cadastro. Enviando POST com payload:', payloadToSend);
        this.permissaoService.createPermissao(payloadToSend as Permissao).subscribe({
          next: (newPermissao) => {
            console.log('Permissão criada com sucesso:', newPermissao);
            this.router.navigate(['/cadastros/usuario/permissoes/consultar']); // Volta para a lista
          },
          error: (err) => {
            console.error('Erro ao criar permissão:', err);
            // Aqui você pode adicionar feedback visual ao usuário
          }
        });
      }
    } else {
      this.permissaoForm.markAllAsTouched(); // Marca todos os campos como "touched" para exibir erros
      console.log('PermissaoFormComponent: Formulário inválido. Não enviando requisição.');
    }
  }

  onCancel(): void {
    console.log('PermissaoFormComponent: Botão Cancelar clicado.');
    this.router.navigate(['/cadastros/usuario/permissoes/consultar']); // Volta para a lista
  }

}
