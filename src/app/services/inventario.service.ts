import { Injectable, signal, effect, inject } from '@angular/core'; //todo Importações de hooks e states do Angular
import { HttpClient } from '@angular/common/http'; //todo Serviço HTTP do Angular para requisições externas

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private http = inject(HttpClient);
  private storageKey = 'lumen_inventario';
  
  // Inicializa com o que tiver no Storage
  items = signal<any[]>(this.carregarDoStorage()); //todo Signal é o equivalente ao useState do React para armazenar 
  // todo os itens do inventário. Aqui está seu estado global. Qualquer componente que ler esse signal ou estado, 
  // todo será avisado automaticamente quando os dados mudarem. 

  constructor() { //todo O construtor garante que o serviço é instanciado. Aqui, ele inicializa o inventário e configura a persistência.
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
  } //todo O effect é um hook que observa mudanças em signals. Sempre que a lista de inventário muda, 
  // // todo ele automaticamente sincroniza os dados com o LocalStorage. 

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
  } //todo Este método busca o inventário original de um arquivo JSON local. 
  // todo Ele é chamado apenas se o LocalStorage estiver vazio, garantindo que o sistema tenha dados iniciais para exibir.
  // todo ele é o equivalente ao fetch do React, mas mais simples e integrado ao Angular.
  
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