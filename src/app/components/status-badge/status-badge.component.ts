import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span 
      class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit"
      [class.bg-emerald-100]="status() === 'Disponível'"
      [class.text-emerald-700]="status() === 'Disponível'"
      [class.bg-amber-100]="status() === 'Manutenção'"
      [class.text-amber-700]="status() === 'Manutenção'"
      [class.bg-blue-100]="status() === 'Alocado'"
      [class.text-blue-700]="status() === 'Alocado'"
    >
      <span class="w-2 h-2 rounded-full bg-current"></span>
      {{ status() }}
    </span>
  `
})
export class StatusBadgeComponent {
  status = input.required<'Disponível' | 'Alocado' | 'Manutenção'>();
}