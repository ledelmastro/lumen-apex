import { ChangeDetectionStrategy, Component, signal, input, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({ // Removido standalone: true - é o padrão no Angular v20+
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside 
      [class.w-64]="!isCollapsed()"
      [class.w-20]="isCollapsed()" 
      class="bg-slate-950 text-white h-full flex-col border-r border-slate-800 transition-all duration-300 ease-in-out relative
             md:flex"
      [class.hidden]="!isMobileMenuOpen()"
      [class.fixed]="isMobileMenuOpen()"
      [class.inset-y-0]="isMobileMenuOpen()"
      [class.left-0]="isMobileMenuOpen()"
      [class.z-50]="isMobileMenuOpen()"
      [class.flex]="isMobileMenuOpen() || !isMobile()"
    >
      <!-- Backdrop para mobile -->
      @if (isMobileMenuOpen()) {
        <div 
          (click)="toggleMobileMenu()"
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
        ></div>
      }

      <!-- Conteúdo da Sidebar -->
      <div 
        [class.w-64]="!isCollapsed()"
        [class.w-20]="isCollapsed()"
        class="bg-slate-950 text-white h-full flex flex-col border-r border-slate-800 transition-all duration-300 ease-in-out relative z-50"
      >
      
      <!-- Botão Toggle (Estilo Stripe) -->
      <button 
        (click)="toggle()"
        class="absolute -right-3 top-10 bg-slate-800 border border-slate-700 rounded-full p-1 hover:bg-slate-700 transition-colors z-50"
      >
        <span [class.rotate-180]="isCollapsed()" class="block transition-transform text-[10px]">◀</span>
      </button>

      <!-- Logo -->
      <div class="h-20 flex items-center px-6 overflow-hidden whitespace-nowrap">
        <div class="min-w-[32px] h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          L
        </div>
        @if (!isCollapsed()) {
        <span class="ml-3 text-lg font-bold tracking-tight animate-fade-in">
          <span class="text-blue-400">Lumen</span> Apex
        </span>
        }
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-2">
        @for (item of menuItems; track item.path) {
          <a 
            [routerLink]="item.path"
            routerLinkActive="bg-blue-600/10 text-blue-400 border-r-2 border-blue-500"
            class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-all overflow-hidden"
          >
            <span class="text-xl group-hover:scale-110 transition-transform">{{ item.icon }}</span>
            @if (!isCollapsed()) { <span class="whitespace-nowrap animate-fade-in">{{ item.label }}</span> }
          </a>
        }
      </nav>

      <!-- Footer Interativo (Admin) -->
      <div class="p-4 border-t border-slate-900 overflow-hidden">
        <a routerLink="/perfil" class="flex items-center gap-3 group cursor-pointer hover:bg-slate-900/50 p-2 rounded-xl transition-all">
          <!-- Avatar com Letra Corrigido -->
          <div class="w-8 h-8 rounded-lg bg-slate-800 flex-shrink-0 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
            A
          </div>
          
          @if (!isCollapsed()) {
          <div class="animate-fade-in">
            <p class="text-[10px] text-slate-500 uppercase tracking-wider font-bold group-hover:text-blue-400 transition-colors">Admin</p>
            <p class="text-xs text-slate-300">Lumen Tecnologia</p>
          </div>
          }
        </a>
      </div>

      </div>
    </aside>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `]
})
export class SidebarComponent {
  isMobileMenuOpen = input(false);
  toggleMobileMenu = input.required<() => void>();
  isCollapsed = signal(false);
  isMobile = signal(window.innerWidth < 768); 

  menuItems = [
    { path: '/painel', label: 'Painel', icon: '📊' },     
    { path: '/portfolio', label: 'Portfólio', icon: '💼' },
    { path: '/chamados', label: 'Chamados', icon: '🛠️' },
    { path: '/inventario', label: 'Inventário', icon: '📦' },
    { path: '/relatorios', label: 'Relatórios', icon: '📈' },
  ];

  toggle() {
    this.isCollapsed.update(v => !v);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: any): void {
    if (event.key === 'Escape' && this.isMobileMenuOpen()) {
      this.toggleMobileMenu()();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }
}