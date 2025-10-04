import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Cliente, CategoriaAparato, Aparato, Orden } from "@core/domain";

let sb: SupabaseClient | null = null;
export function initSupabase(url: string, anonKey: string) {
  sb = createClient(url, anonKey);
}

export const Clientes = {
  async upsert(c: Cliente) { if(!sb) throw new Error("supabase no inicializado");
    const { error } = await sb.from("clientes").upsert(c); if(error) throw error; return c;
  }
};
export const Categorias = {
  async upsert(cat: CategoriaAparato) { if(!sb) throw new Error("supabase no inicializado");
    const { error } = await sb.from("categorias_aparatos").upsert(cat); if(error) throw error; return cat;
  }
};
export const AparatosRepo = {
  async upsert(a: Aparato) { if(!sb) throw new Error("supabase no inicializado");
    const { error } = await sb.from("aparatos").upsert(a); if(error) throw error; return a;
  }
};
export const OrdenesRepo = {
  async upsert(o: Orden) { if(!sb) throw new Error("supabase no inicializado");
    const { error } = await sb.from("ordenes").upsert(o); if(error) throw error; return o;
  }
};
