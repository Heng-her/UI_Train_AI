type AlertType = "success" | "warn" | "error";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  type: AlertType;
  onClose: () => void;
};

const colorsHex = {
  success: "#16a34a",
  warn: "#f59e0b",
  error: "#dc2626",
};

export function AlertDialog({ open, title, subtitle, type, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        className="rounded-lg bg-white w-80 border-l-6 p-6 text-center"
        style={{ borderColor: colorsHex[type] }}
      >
        <h2
          className="text-lg font-semibold mb-2"
          style={{ color: colorsHex[type] }}
        >
          {title}
        </h2>
        {subtitle && <p className="mb-4 text-gray-700">{subtitle}</p>}
        <button
          onClick={onClose}
          className="px-4 py-2 rounded hover:opacity-90 transition"
          style={{ backgroundColor: colorsHex[type] }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
