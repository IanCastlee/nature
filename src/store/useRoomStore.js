import { create } from "zustand";

export const useRoomStore = create((set) => ({
  showForm: null,
  setShowForm: (value) => set({ showForm: value }),
}));

export const useRoomCategoryForm = create((set) => ({
  showForm: null,
  setShowForm: (value) => set({ showForm: value }),
}));
