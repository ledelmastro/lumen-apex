import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private http = inject(HttpClient);
  private storageKey = 'lumen_inventario';
  
  // Inicializa com o que tiver no Storage
  items = signal<any[]>(this.carregarDoStorage());

  constructor() {
    // Se o Storage estiver vazio, busca o JSON inicial
    if (this.items().length === 0) {
      this.buscarJsonOriginal();
    }

    // Monitora o signal e persiste no LocalStorage automaticamente
    effect(() => {
      const dados = this.items();
      localStorage.setItem(this.storageKey, JSON.stringify(dados));
      console.log('📦 LocalStorage (Inventário) atualizado via Effect');
    });
  }

  private carregarDoStorage(): any[] {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [];
  }

  private buscarJsonOriginal() {
    this.http.get<any[]>('assets/data/inventario.json').subscribe({
      next: (dados) => {
        if (dados) {
          this.items.set(dados); 
        }
      },
      error: (err) => console.error('Erro ao ler JSON de inventário:', err)
    });
  }

  // --- MÉTODOS DE AÇÃO (CRUD) ---

  adicionarItem(item: any) {
    // Adiciona o novo ativo à lista
    this.items.update(lista => [...lista, item]);
  }

  atualizarItem(itemEditado: any) {
    // Localiza o item pelo ID e substitui pelos novos dados
    this.items.update(lista => 
      lista.map(item => item.id === itemEditado.id ? itemEditado : item)
    );
  }

  removerItem(id: number) {
    // Filtra a lista removendo o ID especificado
    this.items.update(lista => lista.filter(item => item.id !== id));
  }
  
  resetarParaPadrao() {
  if (confirm("Isso apagará todas as modificações locais e restaurará o inventário original. Continuar?")) {
    localStorage.removeItem(this.storageKey);
    this.buscarJsonOriginal();
  }
}
}