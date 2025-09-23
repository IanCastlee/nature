import { create } from "zustand";

const useThemeStore = create((set) => ({
  darkMode: false,
  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.darkMode;
      const root = document.documentElement;

      if (newMode) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return { darkMode: newMode };
    }),
  initializeTheme: () =>
    set(() => {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      return { darkMode: isDark };
    }),
}));

export default useThemeStore;
