import { useEffect, useState } from "react";
import { searchLocations } from "../api/weatherstack";

interface SearchBarProps {
  value: string;
  onChange(value: string): void;
  onSubmit(): void;
}

interface LocationSuggestion {
  name: string;
  country: string;
  region?: string;
}

export const SearchBar = ({ value, onChange, onSubmit }: SearchBarProps) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!value || value.length < 3) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchLocations(value);
        if (!cancelled && data && Array.isArray(data.result)) {
          setSuggestions(
            data.result.map((item: any) => ({
              name: item.name,
              country: item.country,
              region: item.region
            }))
          );
        }
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    const id = setTimeout(run, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [value]);

  return (
    <div className="search-wrapper glass-panel">
      <div className="search-row">
        <div className="search-input-wrapper">
          <input
            className="search-input"
            placeholder="Search any city, lat/long or IP..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
          />
          {isLoading && <span className="search-spinner" />}
        </div>
        <button className="primary-btn" onClick={onSubmit}>
          View insights
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions-list">
          {suggestions.slice(0, 6).map((s, idx) => (
            <button
              key={`${s.name}-${s.country}-${idx}`}
              className="suggestion-item"
              onClick={() => {
                onChange(`${s.name}, ${s.region ? `${s.region}, ` : ""}${s.country}`);
                setSuggestions([]);
                onSubmit();
              }}
            >
              <span className="suggestion-name">{s.name}</span>
              <span className="suggestion-meta">
                {[s.region, s.country].filter(Boolean).join(" · ")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
