import { create } from "zustand";
export const useSeleccion = create((set) => ({
    ordenId: undefined,
    setOrdenId: (id) => set({ ordenId: id }),
}));
