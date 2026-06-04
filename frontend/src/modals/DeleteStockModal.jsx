import useModalStore from "../store/useModalStore";
import useStockStore from "../store/useStockStore";

import { auth } from "../services/firebase";
import { deleteHolding } from "../services/firestoreService";

export default function DeleteStockModal() {
  const {
    isDeleteModalOpen,
    deleteHolding: selectedStock,
    closeDeleteModal,
  } = useModalStore();

  const removeHolding = useStockStore(
    (state) => state.removeHolding
  );

  if (!isDeleteModalOpen || !selectedStock) {
    return null;
  }

  const handleDelete = async () => {
    try {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        console.error("User not authenticated");
        return;
      }

      if (!selectedStock?.id) {
        console.error("No stock ID provided");
        return;
      }

      // Delete from Firestore
      await deleteHolding(uid, selectedStock.id);

      // Remove from Zustand store
      removeHolding(selectedStock.id);

      // Close modal
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete holding:", error);
      // Optional: Add toast notification here
      // toast.error("삭제에 실패했습니다.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeDeleteModal}
    >
      <div
        className=" w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className=" text-xl font-bold text-white mb-4">
          정말 삭제하시겠습니까?
        </h2>

        <p className="text-zinc-400 mb-2">
          <strong>{selectedStock.stockName}</strong>
        </p>

        <p className="text-zinc-400 mb-6">
          삭제 후 복구할 수 없습니다.
        </p>

        <div className="flex gap-3">
          <button
            className="flex-1 h-12 rounded-xl bg-zinc-700 text-white hover:bg-zinc-600 transition"
            onClick={closeDeleteModal}
          >
            취소
          </button>

          <button
            className="flex-1 h-12 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
