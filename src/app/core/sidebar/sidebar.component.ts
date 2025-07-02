import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    // Propriedades para controlar a expansão de submenus (opcional, se quiser um controle mais dinâmico)
  // Por enquanto, faremos com CSS, mas essa é uma opção para JS.
  isSubmenuOpen: { [key: string]: boolean } = {};

  toggleSubmenu(menuName: string): void {
    this.isSubmenuOpen[menuName] = !this.isSubmenuOpen[menuName];
  }
}
