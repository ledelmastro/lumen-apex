import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  
  readonly darkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    this.applyTheme();
  }

  toggleTheme() {
    this.darkMode.update((v) => !v);
    this.applyTheme();
  }

  private getInitialTheme(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  }

  private applyTheme() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.darkMode()) {
      this.document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}