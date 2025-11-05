export default function Button({ label, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-5 py-2 bg-black text-white font-semibold rounded-xl hover:bg-neutral-900 transition-all duration-300 shadow-smooth"
    >
      {label}
    </button>
  );
}