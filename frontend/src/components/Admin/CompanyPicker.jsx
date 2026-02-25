import { useState } from "react";
import { FaTrash, FaPlus, FaImage, FaBuilding } from "react-icons/fa";

/**
 * CompanyPicker — Admin me har company ka naam + image URL add karo
 * Props:
 *   value: [{name, logoUrl}]  — currently added companies
 *   onChange: (arr) => void
 */
const CompanyPicker = ({ value = [], onChange }) => {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [preview, setPreview] = useState(false);

  const addCompany = () => {
    const trimName = name.trim();
    if (!trimName) return;
    onChange([...value, { name: trimName, logoUrl: logoUrl.trim() }]);
    setName("");
    setLogoUrl("");
    setPreview(false);
  };

  const removeCompany = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCompany();
    }
  };

  return (
    <div className="space-y-3">
      {/* Added Companies List */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
          {value.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm"
            >
              {c.logoUrl ? (
                <img
                  src={c.logoUrl}
                  alt={c.name}
                  className="w-5 h-5 object-contain rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%23e5e7eb'/%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center text-[9px] font-bold text-indigo-600">
                  {c.name[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {c.name}
              </span>
              <button
                type="button"
                onClick={() => removeCompany(i)}
                className="text-gray-300 hover:text-red-500 transition-colors ml-0.5"
                title="Remove"
              >
                <FaTrash size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new company row */}
      <div className="flex flex-col gap-2">
        {/* Name + Logo URL inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Company Name */}
          <div className="relative">
            <FaBuilding
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={12}
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Company name (e.g. TCS)"
              className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-indigo-400 focus:ring-3 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>

          {/* Logo URL */}
          <div className="relative">
            <FaImage
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={12}
            />
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => {
                setLogoUrl(e.target.value);
                setPreview(!!e.target.value.trim());
              }}
              onKeyDown={handleKeyDown}
              placeholder="Logo image URL (optional)"
              className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-indigo-400 focus:ring-3 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Preview + Add button */}
        <div className="flex items-center gap-2">
          {/* Live logo preview */}
          {preview && logoUrl && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              <span className="text-xs text-gray-500">Preview:</span>
              <img
                src={logoUrl}
                alt="preview"
                className="w-6 h-6 object-contain rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%23fee2e2'/%3E%3Ctext x='12' y='16' text-anchor='middle' font-size='10' fill='%23ef4444'%3E!%3C/text%3E%3C/svg%3E";
                  setPreview(false);
                }}
              />
              {name && (
                <span className="text-xs font-medium text-gray-700">
                  {name}
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={addCompany}
            disabled={!name.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FaPlus size={11} />
            Add Company
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        💡 Logo URL ke liye Google Images ya company website se copy karo, ya
        koi bhi image URL paste karo.
      </p>
    </div>
  );
};

export default CompanyPicker;
