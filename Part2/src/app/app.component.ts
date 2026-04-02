import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-wrapper">
      <nav class="navbar">
        <div class="navbar-brand">
          <span class="brand-icon">📦</span>
          <span class="brand-text">Inventory System</span>
        </div>
        <div class="navbar-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/inventory" routerLinkActive="active">Inventory</a>
          <a routerLink="/search" routerLinkActive="active">Search</a>
          <a routerLink="/privacy" routerLinkActive="active">Privacy</a>
          <a routerLink="/help" routerLinkActive="active">Help</a>
        </div>
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div class="navbar-mobile" [class.open]="mobileMenuOpen">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">Home</a>
        <a routerLink="/inventory" routerLinkActive="active" (click)="closeMobileMenu()">Inventory</a>
        <a routerLink="/search" routerLinkActive="active" (click)="closeMobileMenu()">Search</a>
        <a routerLink="/privacy" routerLinkActive="active" (click)="closeMobileMenu()">Privacy</a>
        <a routerLink="/help" routerLinkActive="active" (click)="closeMobileMenu()">Help</a>
      </div>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <p>Inventory Management System - Part 2 | PROG2005 Programming Mobile Systems</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      color: white;
      padding: 0 var(--spacing-lg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      box-shadow: var(--shadow-md);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-weight: 600;
      font-size: var(--font-lg);
    }

    .brand-icon {
      font-size: 1.5rem;
    }

    .navbar-links {
      display: flex;
      gap: var(--spacing-xs);
    }

    .navbar-links a {
      color: rgba(255, 255, 255, 0.85);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius);
      font-size: var(--font-sm);
      font-weight: 500;
      transition: all var(--transition-fast);
      text-decoration: none;
    }

    .navbar-links a:hover {
      background-color: rgba(255, 255, 255, 0.15);
      color: white;
    }

    .navbar-links a.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--spacing-sm);
    }

    .mobile-menu-btn span {
      width: 24px;
      height: 2px;
      background-color: white;
      border-radius: 2px;
      transition: all var(--transition-fast);
    }

    .navbar-mobile {
      display: none;
      flex-direction: column;
      background-color: var(--primary-dark);
      padding: var(--spacing-md);
      gap: var(--spacing-xs);
    }

    .navbar-mobile.open {
      display: flex;
    }

    .navbar-mobile a {
      color: rgba(255, 255, 255, 0.85);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius);
      font-size: var(--font-sm);
      font-weight: 500;
      text-decoration: none;
    }

    .navbar-mobile a.active,
    .navbar-mobile a:hover {
      background-color: rgba(255, 255, 255, 0.15);
      color: white;
    }

    .main-content {
      flex: 1;
    }

    .app-footer {
      background-color: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      padding: var(--spacing-lg);
      text-align: center;
      color: var(--text-muted);
      font-size: var(--font-sm);
    }

    @media (max-width: 768px) {
      .navbar-links {
        display: none;
      }

      .mobile-menu-btn {
        display: flex;
      }

      .navbar-brand .brand-text {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
