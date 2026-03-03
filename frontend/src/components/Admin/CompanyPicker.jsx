import { useState } from "react";
import { FaTrash, FaPlus, FaImage, FaBuilding } from "react-icons/fa";
import { findCompany, COMPANIES } from "../../lib/companyLogos";

const CompanyIcon = ({ name, url }) => {
  const match = findCompany(name);
  const domain = match?.domain || null;
  const sources = [
    url || null,
    domain ? `https://logo.clearbit.com/${domain}` : null,
    domain ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}` : null,
  ].filter(Boolean);

  const [idx, setIdx] = useState(0);
  const current = sources[idx];

  if (current) {
    return (
      <img
        src={current}
        alt={name}
        className="w-5 h-5 object-contain rounded bg-white"
        onError={() => setIdx((prev) => prev + 1)}
      />
    );
  }

  return (
    <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center text-[9px] font-bold text-indigo-600 shrink-0">
      {name?.[0]?.toUpperCase()}
    </div>
  );
};

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

  // Determine logo for preview
  const match = findCompany(name);
  const domain = match?.domain || null;
  const previewSources = [
    logoUrl || null,
    domain ? `https://logo.clearbit.com/${domain}` : null,
    domain ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}` : null,
  ].filter(Boolean);

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
              <CompanyIcon name={c.name} url={c.logoUrl} />
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
              list="company-suggestions"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim() && !logoUrl.trim()) {
                  setPreview(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Company name (e.g. TCS)"
              className="w-full pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-indigo-400 focus:ring-3 focus:ring-indigo-500/10 outline-none transition-all"
            />
            <datalist id="company-suggestions">
              {COMPANIES.map((c) => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
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
                setPreview(!!e.target.value.trim() || !!name.trim());
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
          {preview && previewSources.length > 0 && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              <span className="text-xs text-gray-500">Preview:</span>
              <CompanyIcon name={name} url={logoUrl} />
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
        💡 If a known company is typed, logo automatically appears. You can also
        paste a custom Image URL.
      </p>
    </div>
  );
};

export default CompanyPicker;
