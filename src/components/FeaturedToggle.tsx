"use client";

interface FeaturedToggleProps {
  checked: boolean;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  onChange: () => void;
}

/** Small on/off switch for "Featured on homepage". */
export default function FeaturedToggle({ checked, disabled, loading, title, onChange }: FeaturedToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Featured on homepage"
      title={title}
      onClick={onChange}
      disabled={disabled || loading}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed ${
        checked ? "bg-primary-900" : "bg-gray-300"
      } ${disabled && !loading ? "opacity-40" : ""} ${loading ? "opacity-70" : ""}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
