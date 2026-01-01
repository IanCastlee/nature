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
export const useAdminSettingsStore = create((set, get) => ({
  admin: null, // store the full admin settings
  loading: false,

  fetchAdminSettings: async () => {
    if (get().admin || get().loading) return; // prevent multiple fetches

    set({ loading: true });

    try {
      const res = await fetch("/admin/admin_setting.php");
      const data = await res.json();

      set({
        admin: {
          id: data.id,
          email: data.email,
          fb: data.fb,
          ig: data.ig,
          globe_no: data.globe_no,
          smart_no: data.smart_no,
          logo: data.logo,
          hero_heading: data.hero_heading,
          hero_subheading: data.hero_subheading,
          hero_images: data.hero_images,
          holiday_charge: Number(data.holiday_charge) || 0, // make it number
        },
        loading: false,
      });
    } catch (err) {
      console.error("Failed to fetch admin settings:", err);
      set({ loading: false });
    }
  },
}));
