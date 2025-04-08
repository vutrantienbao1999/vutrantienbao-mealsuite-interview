function CancelButton({ handleOnClick }: { handleOnClick: () => void }) {
  return (
    <button
      type="button"
      className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
      onClick={handleOnClick} // Close the dialog
    >
      Cancel
    </button>
  );
}

export default CancelButton;
