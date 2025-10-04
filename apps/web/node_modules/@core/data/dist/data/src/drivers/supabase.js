import { createClient } from "@supabase/supabase-js";
let sb = null;
export function initSupabase(url, anonKey) {
    sb = createClient(url, anonKey);
}
export const Clientes = {
    async upsert(c) {
        if (!sb)
            throw new Error("supabase no inicializado");
        const { error } = await sb.from("clientes").upsert(c);
        if (error)
            throw error;
        return c;
    }
};
export const Categorias = {
    async upsert(cat) {
        if (!sb)
            throw new Error("supabase no inicializado");
        const { error } = await sb.from("categorias_aparatos").upsert(cat);
        if (error)
            throw error;
        return cat;
    }
};
export const AparatosRepo = {
    async upsert(a) {
        if (!sb)
            throw new Error("supabase no inicializado");
        const { error } = await sb.from("aparatos").upsert(a);
        if (error)
            throw error;
        return a;
    }
};
export const OrdenesRepo = {
    async upsert(o) {
        if (!sb)
            throw new Error("supabase no inicializado");
        const { error } = await sb.from("ordenes").upsert(o);
        if (error)
            throw error;
        return o;
    }
};
