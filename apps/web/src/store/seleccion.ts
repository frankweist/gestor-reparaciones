import { create } from "zustand";

type SelState = {
  ordenId?: string;
  setOrdenId: (id?: string) => void;
};

export const useSeleccion = create<SelState>((set) => ({
  ordenId: undefined,
  setOrdenId: (id) => set({ ordenId: id }),
}));
