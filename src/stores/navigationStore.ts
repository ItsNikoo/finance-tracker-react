import {create} from "zustand"

export type AppSection = "home" | "analytics" | "profile"

interface NavigationStore {
  activeSection: AppSection,
  setActiveSection: (section: AppSection) => void,
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  activeSection: "home",
  setActiveSection: section => set({activeSection: section}),
}))
