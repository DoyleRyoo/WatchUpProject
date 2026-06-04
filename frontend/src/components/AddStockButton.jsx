import useModalStore from "../store/useModalStore";

export default function AddStockButton() {
  const openAddModal =
    useModalStore(
      (state) => state.openAddModal
    );

  return (
    <div className="flex justify-end">
      <button
        className="=h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all duration-300 shadow-lg hover:scale-105"
        onClick={openAddModal}
      >
        + Add
      </button>
    </div>
  );
}