import { create } from "zustand";
import { RoutePoint } from "@/utils/routeUtils";

export interface UserNote {
  id: string;
  distance: number; // distance in meters
  gradeText: string;
  text: string;
}

interface RouteState {
  gpxData: any | null; // GeoJSON FeatureCollection
  routePoints: RoutePoint[];
  setGpxData: (data: any) => void;
  setRoutePoints: (points: RoutePoint[]) => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  hoveredPointIndex: number | null;
  setHoveredPointIndex: (index: number | null) => void;
  userNotes: UserNote[];
  addUserNote: (note: UserNote) => void;
  addUserNotes: (notes: UserNote[]) => void;
  updateUserNote: (note: UserNote) => void;
  removeUserNote: (id: string) => void;
  clearUserNotes: () => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  gpxData: null,
  routePoints: [],
  setGpxData: (data) => set({ gpxData: data }),
  setRoutePoints: (points) => set({ routePoints: points }),
  mapCenter: [23.5, 121], // Default center (Taiwan)
  setMapCenter: (center) => set({ mapCenter: center }),
  hoveredPointIndex: null,
  setHoveredPointIndex: (index) => set({ hoveredPointIndex: index }),
  userNotes: [],
  addUserNote: (note) =>
    set((state) => ({
      userNotes: [...state.userNotes, note].sort((a, b) => a.distance - b.distance),
    })),
  addUserNotes: (notes) =>
    set((state) => ({
      userNotes: [...state.userNotes, ...notes].sort(
        (a, b) => a.distance - b.distance,
      ),
    })),
  updateUserNote: (note) =>
    set((state) => ({
      userNotes: state.userNotes
        .map((n) => (n.id === note.id ? note : n))
        .sort((a, b) => a.distance - b.distance),
    })),
  removeUserNote: (id) =>
    set((state) => ({ userNotes: state.userNotes.filter((n) => n.id !== id) })),
  clearUserNotes: () => set({ userNotes: [] }),
}));
