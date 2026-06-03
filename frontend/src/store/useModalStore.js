import { create } from "zustand";

const useModalStore = create((set) => ({
  isAddModalOpen: false,
  editHolding: null,
  sellHolding: null,
  deleteHolding: null,

  openAddModal: () => set({ isAddModalOpen: true }),

  closeAddModal: () => set({ isAddModalOpen: false }),

  openEditModal: (holding) => set({ editHolding: holding, }),

  closeEditModal: () => set({ editHolding: null, }),

  openSellModal: (holding) => set({ sellHolding: holding, }),

  closeSellModal: () => set({ sellHolding: null, }),

  openDeleteModal: (holding) => set({ deleteHolding: holding, }),

  closeDeleteModal: () => set({ deleteHolding: null, }),
}));



export default useModalStore;