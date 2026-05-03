import { ChangeDetectionStrategy, Component, inject, signal, HostListener, input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<header class="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors duration-300">
  
  <!-- Botão Hambúrguer para Mobile -->
  <button 
    (click)="toggleMobileMenu()"
    class="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    aria-label="Abrir menu lateral"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
  </button>

  
  <div class="flex flex-col">
    <span class="text-[10px] uppercase tracking-widest text-gray-500 dark:text-slate-400 font-bold">Lumen Tecnologia</span>
    <h1 class="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
      Lumen <span class="text-blue-600 dark:text-blue-400">Apex</span>
    </h1>
  </div>

  <div class="flex items-center gap-4">
    
    <!-- Botão Dark Mode -->
    <button 
      (click)="theme.toggleTheme()"
      class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:ring-4 ring-blue-500/10 transition-all duration-300"
      [title]="theme.darkMode() ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'"
    >
      <span class="text-lg">{{ theme.darkMode() ? '🌙' : '☀️' }}</span>
    </button>

    <!-- Notificações -->
    <div class="relative">
      <button 
        (click)="toggleNotificacoes($event)"
        class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative"
      >
        <span>🔔</span>
        <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
      </button>

      <!-- Dropdown Notificações -->
      @if (notificacoesAbertas()) {
        <div class="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in zoom-in duration-200">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-bold text-slate-900 dark:text-white">Alertas</h4>
            <span class="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-full">Novo</span>
          </div>
          <div class="space-y-3">
            <p class="text-xs text-slate-500 dark:text-slate-400">Nenhuma notificação pendente para os sistemas da <span class="font-bold">ENABRA</span>.</p>
          </div>
        </div>
      }
    </div>

    <!-- Divisor -->
    <div class="w-[1px] h-6 bg-gray-200 dark:bg-slate-800 mx-1"></div>

    <!-- Avatar Profissional / Perfil -->
    <div class="relative">
      <button 
        (click)="togglePerfil($event)"
        class="flex items-center gap-3 pl-1 group"
      >
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
          L
        </div>
      </button>

      <!-- Dropdown Perfil -->
      @if (perfilAberto()) {
        <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl rounded-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
          <div class="px-4 py-2 border-b border-gray-100 dark:border-slate-800 mb-1">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Usuário Admin</p>
            <p class="text-sm font-semibold text-slate-900 dark:text-white">Lumen Tecnologia</p>
          </div>
          <button class="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Configurações</button>
          <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Sair do Sistema</button>
        </div>
      }
    </div>

  </div>
</header>
`
})
export class HeaderComponent {
  theme = inject(ThemeService);
  isMobileMenuOpen = input(false); // Adicionado input
  toggleMobileMenu = input.required<() => void>(); // Adicionado input

  // Signals para gerenciar abertura dos menus
  notificacoesAbertas = signal(false);
  perfilAberto = signal(false);

  // Fecha menus ao clicar fora do Header
  @HostListener('document:click')
  fecharMenus() {
    this.notificacoesAbertas.set(false);
    this.perfilAberto.set(false);
  }

  toggleNotificacoes(event: Event) {
    event.stopPropagation(); // Evita que o HostListener feche o menu imediatamente
    this.perfilAberto.set(false);
    this.notificacoesAbertas.update(v => !v);
  }

  togglePerfil(event: Event) {
    event.stopPropagation(); // Evita que o HostListener feche o menu imediatamente
    this.notificacoesAbertas.set(false);
    this.perfilAberto.update(v => !v);
  }
}