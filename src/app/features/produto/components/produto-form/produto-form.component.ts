
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Produto } from '../../../../models/produto.models';
import { ProdutoService } from '../../../../services/produtos/produto.service';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.scss'
})
export class ProdutoFormComponent implements OnInit, OnDestroy {
  produtoForm: FormGroup;
  isEditMode: boolean = false;
  produtoId: number | null = null;
  private routeSubscription: Subscription | null = null;

  numeracaoOptions: number[] = [];
  tamanhoOptions: string[] = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', 'XXG1', 'XXG2'];
  categoriaOptions: string[] = ['Masculino', 'Feminino'];

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      codigo_barras: ['', [Validators.pattern(/^\d{13}$/)]],
      numeracao: [null, []],
      tamanho: [null, []],
      cor1: ['', [Validators.maxLength(30)]],
      cor2: ['', [Validators.maxLength(30)]],
      referencia: ['', [Validators.maxLength(50)]],
      preco: [null, [Validators.required, Validators.min(0.01)]],
      categoria: [null, []],
      ativo: [true]
    });

    this.generateNumeracaoOptions();
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.produtoId = +id;

        this.produtoService.getProdutoById(this.produtoId).subscribe({
          next: (data) => {
            this.produtoForm.patchValue({
              nome: data.nome,
              codigo_barras: data.codigo_barras,
              numeracao: data.numeracao,
              tamanho: data.tamanho,
              cor1: data.cor1,
              cor2: data.cor2,
              referencia: data.referencia,
              preco: data.preco,
              categoria: data.categoria,
              ativo: data.ativo
            });
            console.log('Formulário de produto preenchido para edição:', data);
          },
          error: (err) => {
            console.error('Erro ao carregar produto para edição:', err);
            this.router.navigate(['/cadastros/produto/consultar']);
          }
        });
      } else {
        this.isEditMode = false;
        this.produtoId = null;
        this.produtoForm.reset({ ativo: true, preco: null, numeracao: null, tamanho: null, categoria: null });
        console.log('Formulário de produto em modo de cadastro.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private generateNumeracaoOptions(): void {
    for (let i = 2; i <= 50; i += 2) {
      this.numeracaoOptions.push(i);
    }
  }

  onSubmit(): void {
    console.log('ProdutoFormComponent: onSubmit() chamado. Formulário válido?', this.produtoForm.valid);

    if (this.produtoForm.valid) {
      const formValues = this.produtoForm.value; // Pega todos os valores do formulário

      let payloadToSend: Partial<Produto>; // Tipo para o payload

      if (this.isEditMode && this.produtoId) {
        // Para atualização, criamos um novo objeto sem o id_produto no payload
        // O id_produto já vai na URL via this.produtoId
        const { id_produto, ...restOfValues } = formValues; // Desestrutura para remover id_produto
        payloadToSend = restOfValues; // O restante dos valores é o payload

        console.log('ProdutoFormComponent: Modo de Edição. Enviando PUT para ID:', this.produtoId, 'com payload:', payloadToSend);
        this.produtoService.updateProduto(this.produtoId, payloadToSend).subscribe({
          next: (updatedProduto) => {
            console.log('Produto atualizado com sucesso:', updatedProduto);
            this.router.navigate(['/cadastros/produto/consultar']);
          },
          error: (err) => {
            console.error('Erro ao atualizar produto:', err);
            // Aqui você pode adicionar feedback visual ao usuário
          }
        });
      } else {
        // Para criação, o id_produto já é undefined, então enviamos todos os valores do formulário
        payloadToSend = formValues;
        console.log('ProdutoFormComponent: Modo de Cadastro. Enviando POST com payload:', payloadToSend);
        this.produtoService.createProduto(payloadToSend as Produto).subscribe({
          next: (newProduto) => {
            console.log('Produto criado com sucesso:', newProduto);
            this.router.navigate(['/cadastros/produto/consultar']);
          },
          error: (err) => {
            console.error('Erro ao criar produto:', err);
            // Aqui você pode adicionar feedback visual ao usuário
          }
        });
      }
    } else {
      this.produtoForm.markAllAsTouched(); // Marca todos os campos como "touched" para exibir erros
      console.log('ProdutoFormComponent: Formulário inválido. Não enviando requisição.');
    }
  }

  onCancel(): void {
    console.log('ProdutoFormComponent: Botão Cancelar clicado.');
    this.router.navigate(['/cadastros/produto/consultar']);
  }
}
