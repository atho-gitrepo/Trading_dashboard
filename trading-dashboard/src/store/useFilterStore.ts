import { create } from 'zustand';
import { FilterState } from '@/types';

interface FilterStore extends FilterState {
  setType: (type: FilterState['type']) => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  setSortOrder: (sortOrder: FilterState['sortOrder']) => void;
  reset: () => void;
}

const initialState: FilterState = {
  type: 'All',
  search: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setType: (type) => set({ type }),
  setSearch: (search) => set({ search }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  reset: () => set(initialState),
}));
