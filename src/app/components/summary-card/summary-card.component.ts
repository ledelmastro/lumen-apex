import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 relative overflow-hidden">
      <!-- Overlay de Skeleton/Carregamento -->
      @if (isLoading()) {
        <div class="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10 animate-pulse">
           <div class="w-full h-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
      }

      <div class="flex items-center justify-between">
        <span class="text-slate-400 dark:text-slate-500 font-medium uppercase text-xs tracking-wider">{{ label() }}</span>
        <div class="p-2 rounded-lg" [class]="iconBg()">
          <ng-content select="[icon]"></ng-content>
        </div>
      </div>
      <p class="text-4xl font-bold text-slate-800 dark:text-white mt-2 animate-slide-up">
        {{ value() }}
      </p>
    </div>
  `
})
export class SummaryCardComponent {
  label = input.required<string>();
  value = input.required<number | string>();
  iconBg = input<string>('bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400');
  
  // A propriedade que faltava para resolver o erro NG8002:
  isLoading = input<boolean>(false);
}