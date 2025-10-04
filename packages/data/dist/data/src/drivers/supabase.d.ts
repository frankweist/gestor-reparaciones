import type { Cliente, CategoriaAparato, Aparato, Orden } from "@core/domain";
export declare function initSupabase(url: string, anonKey: string): void;
export declare const Clientes: {
    upsert(c: Cliente): Promise<Cliente>;
};
export declare const Categorias: {
    upsert(cat: CategoriaAparato): Promise<CategoriaAparato>;
};
export declare const AparatosRepo: {
    upsert(a: Aparato): Promise<Aparato>;
};
export declare const OrdenesRepo: {
    upsert(o: Orden): Promise<Orden>;
};
