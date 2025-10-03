import { create } from "zustand";

export const useRoomStore = create((set) => ({
  showForm: null,
  setShowForm: (value) => set({ showForm: value }),
}));

export const useForm = create((set) => ({
  showForm: null,
  setShowForm: (value) => set({ showForm: value }),
}));
