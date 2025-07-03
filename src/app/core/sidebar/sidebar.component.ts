import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isMinimized: boolean = false;
  isSubmenuOpen: { [key: string]: boolean } = {};

  constructor() { }

  toggleSubmenu(menuName: string): void {
    this.isSubmenuOpen[menuName] = !this.isSubmenuOpen[menuName];
  }
}
