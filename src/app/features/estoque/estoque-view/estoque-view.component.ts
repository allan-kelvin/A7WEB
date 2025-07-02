import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-estoque-view',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './estoque-view.component.html',
  styleUrl: './estoque-view.component.scss'
})
export class EstoqueViewComponent {

}
