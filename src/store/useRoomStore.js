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

// New: Admin settings store
export const useAdminSettingsStore = create((set) => ({
  settings: null, // store the fetched settings
  setSettings: (data) => set({ settings: data }),
  fetchSettings: async () => {
    try {
      const response = await fetch("/admin/admin_setting.php");
      const data = await response.json();
      set({ settings: data });
    } catch (err) {
      console.error("Failed to fetch admin settings:", err);
    }
  },
}));
