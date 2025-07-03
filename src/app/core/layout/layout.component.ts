import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isSidebarMinimized: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.isSidebarMinimized = !this.isSidebarMinimized;
    console.log('Sidebar minimizada:', this.isSidebarMinimized);
  }
}
