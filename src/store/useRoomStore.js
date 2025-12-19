import { create } from "zustand";

export const useRoomStore = create((set) => ({
  showForm: null,
  setShowForm: (value) => set({ showForm: value }),
}));

export const useForm = create((set) => ({
  showForm: null,
  setShowForm: (value) => set({ showForm: value }),
}));

//  NEW: Announcement counter store
export const useAnnouncementStore = create((set) => ({
  announcementCount: 0,
  setAnnouncementCount: (count) => set({ announcementCount: count }),
}));
