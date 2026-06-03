import useModalStore from "../store/useModalStore";

export default function HoldingOptionMenu({
  stock,
  open,
  onClose,
}) {
  const {
    openEditModal,
    openDeleteModal,
  } = useModalStore();

  const openSellModal = useModalStore((state) => state.openSellModal);

  if (!open) return null;

  return (
    <div
      className="absolute right-0 top-10 w-28 bg-zinc-900  border border-zinc-700 rounded-xl overflow-hidden shadow-xl z-50"
      onClick={(e) => e.stopPropagation()}
    >

      <button
        onClick={() => {
          openSellModal(stock);
          onClose();
        }}
        className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition"
      >
        판매
      </button>

      <button
        onClick={() => {
          openEditModal(stock);
          onClose();
        }}
        className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition        "
      >
        수정
      </button>

      <button
        onClick={() => {
          openDeleteModal(stock);
          onClose();
        }}
        className="w-full px-4 py-3 text-left text-red-500 hover:bg-zinc-800 transition"
      >
        삭제
      </button>
    </div>
  );
}