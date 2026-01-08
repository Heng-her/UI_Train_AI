type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  txtfoooter?: string;
};

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = true,
  txtfoooter,
}: Props) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {/* Label with optional required asterisk */}
      <label className="text-sm font-semibold text-blue-500 mt-3 flex items-center gap-1">
        {label}
        {required && <span className="text-red-700 text-sm">*</span>}
      </label>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        required={required}
        className="
          w-full
          pb-5
          px-4 py-3 
          text-sm text-gray-800 
          bg-white 
          border border-gray-200 
          rounded-xl 
          overflow-x-auto
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
      <p className="text-xs text-red-500 italic -mt-6 bg-white ml-3 w-fit border p-1.5 border-gray-200 rounded-xl">
        {txtfoooter ?? "Press ⏎ (Enter) to create a new line"}
      </p>
    </div>
  );
}
