import { create } from 'zustand';

export interface UserNote {
  id: string;
  distance: number; // distance in meters
  text: string;
  type: 'climb' | 'food' | 'sprint' | 'other';
}

interface RouteState {
  gpxData: any | null; // GeoJSON FeatureCollection
  setGpxData: (data: any) => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  userNotes: UserNote[];
  addUserNote: (note: UserNote) => void;
  removeUserNote: (id: string) => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  gpxData: null,
  setGpxData: (data) => set({ gpxData: data }),
  mapCenter: [23.5, 121], // Default center (Taiwan)
  setMapCenter: (center) => set({ mapCenter: center }),
  userNotes: [],
  addUserNote: (note) => set((state) => ({ userNotes: [...state.userNotes, note] })),
  removeUserNote: (id) => set((state) => ({ userNotes: state.userNotes.filter((n) => n.id !== id) })),
}));
