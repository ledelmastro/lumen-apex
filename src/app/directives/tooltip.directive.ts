import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  Renderer2,
  Input,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnInit, OnDestroy {
  // Input obrigatório para o texto do tooltip
  appTooltip = input.required<string>({ alias: 'appTooltip' });
  
  // Controle para exibir ou não o ícone (padrão é true)
  // Use [showIcon]="false" no HTML para esconder o ícone em locais específicos
  @Input() showIcon: boolean = true;

  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private document = inject(DOCUMENT);

  private tooltipElement: HTMLElement | null = null;
  private infoIconElement: HTMLElement | null = null;
  private isMobile = window.innerWidth <= 768;
  private unlistenDocumentClick: (() => void) | null = null;

  ngOnInit(): void {
    // Adicionamos um pequeno delay para garantir que o Angular 
    // tenha processado o valor do [showIcon]="false" antes de criar o ícone
    setTimeout(() => {
      if (this.isMobile && this.showIcon) {
        this.createInfoIcon();
      }
    });
  }
  
  ngOnDestroy(): void {
    this.hide();
    this.unlistenDocumentClick?.();
    if (this.infoIconElement) {
      const parent = this.renderer.parentNode(this.infoIconElement);
      if (parent) this.renderer.removeChild(parent, this.infoIconElement);
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.isMobile) this.show();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hide();
  }

  private show() {
    if (this.tooltipElement) return;

    this.tooltipElement = this.renderer.createElement('div');
    this.tooltipElement!.textContent = this.appTooltip();

    this.renderer.addClass(this.tooltipElement!, 'fixed');
    this.renderer.addClass(this.tooltipElement!, 'bg-slate-900');
    this.renderer.addClass(this.tooltipElement!, 'text-white');
    this.renderer.addClass(this.tooltipElement!, 'text-[10px]');
    this.renderer.addClass(this.tooltipElement!, 'px-3');
    this.renderer.addClass(this.tooltipElement!, 'py-1.5');
    this.renderer.addClass(this.tooltipElement!, 'rounded-lg');
    this.renderer.addClass(this.tooltipElement!, 'z-[9999]');
    this.renderer.addClass(this.tooltipElement!, 'shadow-xl');

    this.renderer.appendChild(this.document.body, this.tooltipElement);
    this.positionTooltip();

    setTimeout(() => {
      this.unlistenDocumentClick = this.renderer.listen(this.document, 'click', (event) => {
        if (this.tooltipElement && !this.tooltipElement.contains(event.target)) {
          this.hide();
        }
      });
    });
  }

  private hide() {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.document.body, this.tooltipElement);
      this.tooltipElement = null;
      this.unlistenDocumentClick?.();
    }
  }

  private createInfoIcon() {
    const wrapper = this.renderer.createElement('span');
    this.renderer.addClass(wrapper, 'inline-flex');
    this.renderer.addClass(wrapper, 'flex-row');
    this.renderer.addClass(wrapper, 'items-center');
    this.renderer.addClass(wrapper, 'ml-2');

    const parent = this.renderer.parentNode(this.elementRef.nativeElement);
    this.renderer.insertBefore(parent, wrapper, this.elementRef.nativeElement);
    this.renderer.appendChild(wrapper, this.elementRef.nativeElement);

    const icon = this.renderer.createElement('span');
    icon.innerHTML = 'ⓘ';
    icon.className = 'text-blue-500 cursor-pointer text-[10px] select-none';

    this.renderer.listen(icon, 'click', (event: Event) => {
      event.stopPropagation();
      this.show();
    });

    this.renderer.appendChild(wrapper, icon);
    this.infoIconElement = icon;
  }

  private positionTooltip() {
    if (!this.tooltipElement) return;
    const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipElement.getBoundingClientRect();

    const spaceAbove = hostPos.top;
    const preferBelow = spaceAbove < (tooltipPos.height + 20);

    let top = preferBelow
      ? hostPos.bottom + 8
      : hostPos.top - tooltipPos.height - 8;

    let left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    if (left < 10) left = 10;
    if (left + tooltipPos.width > window.innerWidth - 10) left = window.innerWidth - tooltipPos.width - 10;

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }
}