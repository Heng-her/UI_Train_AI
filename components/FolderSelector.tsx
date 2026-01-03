type Props = {
  folders: string[];
  selectedFolder: string;
  onSelect: (v: string) => void;
  newFolderName: string;
  onNewNameChange: (v: string) => void;
  onCreate: () => void;
};

export function FolderSelector({
  folders,
  selectedFolder,
  onSelect,
  newFolderName,
  onNewNameChange,
  onCreate,
}: Props) {
  const isCreatingNew = selectedFolder === "__new__";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <select
          value={selectedFolder}
          onChange={(e) => onSelect(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all"
        >
          <option value="">-- Select Folder --</option>
          {folders.map((f) => (
            <option key={f} value={f}>
              📂 {f}
            </option>
          ))}
          <option value="__new__" className="font-semibold text-blue-600">
            + Create New Folder
          </option>
        </select>
      </div>

      {/* Inline Creation Form */}
      {isCreatingNew && (
        <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100 animate-in zoom-in-95 duration-200">
          <input
            value={newFolderName}
            onChange={(e) => onNewNameChange(e.target.value)}
            placeholder="Enter folder name..."
            className="flex-1 bg-white border border-blue-200 text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
          />
          <button
            onClick={onCreate}
            disabled={!newFolderName.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors shadow-sm"
          >
            Create
          </button>
        </div>
      )}
    </div>
  );
}