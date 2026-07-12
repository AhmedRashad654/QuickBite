import { create } from "zustand";

interface PresenceState {
  isOnline: boolean;
  setOnline: (value: boolean) => void;
}

export const usePresenceStore = create<PresenceState>()((set) => ({
  isOnline: false,
  setOnline: (value) => set({ isOnline: value }),
}));
