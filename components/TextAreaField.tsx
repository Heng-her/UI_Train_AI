type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
};

export function TextAreaField({ label, value, onChange, placeholder, required }: Props) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {/* Label with optional required asterisk */}
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        required={required}
        className="
          w-full 
          px-4 py-3 
          text-sm text-gray-800 
          bg-white 
          border border-gray-200 
          rounded-xl 
          placeholder:text-gray-400
          transition-all duration-200
          outline-none
          /* Focus States */
          focus:border-blue-500 
          focus:ring-4 
          focus:ring-blue-500/10
          /* Hover States */
          hover:border-gray-300
          /* Scrollbar styling */
          scrollbar-thin scrollbar-thumb-gray-200
        "
      />
    </div>
  );
}