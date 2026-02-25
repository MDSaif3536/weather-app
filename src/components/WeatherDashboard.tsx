import { useEffect, useState } from "react";
import {
  fetchCurrent,
  fetchForecast,
  fetchHistorical,
  fetchMarine,
  type WeatherMode
} from "../api/weatherstack";
import { SearchBar } from "./SearchBar";

type Units = "m" | "f" | "s";

type TabId = "current" | "forecast" | "historical" | "marine" | "locations";

interface HistoricalFilterState {
  dateMode: "single" | "range";
  date: string;
  from: string;
  to: string;
}

export const WeatherDashboard = () => {
  const [query, setQuery] = useState("Berlin, Germany");
  const [units, setUnits] = useState<Units>("m");
  const [activeTab, setActiveTab] = useState<TabId>("current");
  const [forecastDays, setForecastDays] = useState(5);
  const [historical, setHistorical] = useState<HistoricalFilterState>({
    dateMode: "single",
    date: "",
    from: "",
    to: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<any | null>(null);

  const effectiveMode: WeatherMode =
    activeTab === "locations" ? "current" : (activeTab as WeatherMode);

  const runQuery = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      let data: any;
      if (effectiveMode === "current") {
        data = await fetchCurrent({ query, units });
      } else if (effectiveMode === "forecast") {
        data = await fetchForecast({ query, units, forecastDays });
      } else if (effectiveMode === "historical") {
        data = await fetchHistorical({
          query,
          units,
          date: historical.dateMode === "single" ? historical.date : undefined,
          dateFrom: historical.dateMode === "range" ? historical.from : undefined,
          dateTo: historical.dateMode === "range" ? historical.to : undefined
        });
      } else {
        data = await fetchMarine({ query, units });
      }
      setPayload(data);
    } catch (e: any) {
      setError(e.message ?? "Unable to load data from Weatherstack.");
      setPayload(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unitLabel = units === "m" ? "Metric" : units === "f" ? "Fahrenheit" : "Scientific";

  return (
    <section className="dashboard">
      <div className="dashboard-grid">
        <div>
          <SearchBar value={query} onChange={setQuery} onSubmit={runQuery} />

          <div className="controls-row">
            <div className="glass-panel segmented-control">
              <span className="segmented-label">Data mode</span>
              <div className="segmented-buttons">
                {(["current", "forecast", "historical", "marine", "locations"] as TabId[]).map(
                  (tab) => (
                    <button
                      key={tab}
                      className={
                        "segmented-btn" + (activeTab === tab ? " segmented-btn-active" : "")
                      }
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "current" && "Current"}
                      {tab === "forecast" && "Forecast"}
                      {tab === "historical" && "Historical"}
                      {tab === "marine" && "Marine"}
                      {tab === "locations" && "Locations"}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="glass-panel segmented-control">
              <span className="segmented-label">Units</span>
              <div className="segmented-buttons">
                <button
                  className={"segmented-btn" + (units === "m" ? " segmented-btn-active" : "")}
                  onClick={() => setUnits("m")}
                >
                  Metric
                </button>
                <button
                  className={"segmented-btn" + (units === "f" ? " segmented-btn-active" : "")}
                  onClick={() => setUnits("f")}
                >
                  Fahrenheit
                </button>
                <button
                  className={"segmented-btn" + (units === "s" ? " segmented-btn-active" : "")}
                  onClick={() => setUnits("s")}
                >
                  Scientific
                </button>
              </div>
            </div>
          </div>

          {activeTab === "forecast" && (
            <div className="glass-panel filters-row">
              <div className="filters-title">Forecast configuration</div>
              <label className="filter-field">
                <span>Days ahead</span>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={forecastDays}
                  onChange={(e) => setForecastDays(Number(e.target.value) || 1)}
                />
              </label>
            </div>
          )}

          {activeTab === "historical" && (
            <div className="glass-panel filters-row">
              <div className="filters-title">Historical range</div>
              <div className="filters-switch">
                <button
                  className={
                    "segmented-btn" +
                    (historical.dateMode === "single" ? " segmented-btn-active" : "")
                  }
                  onClick={() =>
                    setHistorical((prev) => ({
                      ...prev,
                      dateMode: "single"
                    }))
                  }
                >
                  Single day
                </button>
                <button
                  className={
                    "segmented-btn" +
                    (historical.dateMode === "range" ? " segmented-btn-active" : "")
                  }
                  onClick={() =>
                    setHistorical((prev) => ({
                      ...prev,
                      dateMode: "range"
                    }))
                  }
                >
                  Date range
                </button>
              </div>
              {historical.dateMode === "single" ? (
                <label className="filter-field">
                  <span>Date</span>
                  <input
                    type="date"
                    value={historical.date}
                    onChange={(e) =>
                      setHistorical((prev) => ({
                        ...prev,
                        date: e.target.value
                      }))
                    }
                  />
                </label>
              ) : (
                <div className="filter-range">
                  <label className="filter-field">
                    <span>From</span>
                    <input
                      type="date"
                      value={historical.from}
                      onChange={(e) =>
                        setHistorical((prev) => ({
                          ...prev,
                          from: e.target.value
                        }))
                      }
                    />
                  </label>
                  <label className="filter-field">
                    <span>To</span>
                    <input
                      type="date"
                      value={historical.to}
                      onChange={(e) =>
                        setHistorical((prev) => ({
                          ...prev,
                          to: e.target.value
                        }))
                      }
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          <div className="glass-panel summary-card">
            <div className="summary-header">
              <div>
                <div className="summary-title">Overview</div>
                <div className="summary-subtitle">
                  {query} · {unitLabel} · {activeTab.toUpperCase()}
                </div>
              </div>
              {isLoading && <span className="chip chip-pending">Fetching live data…</span>}
              {!isLoading && payload && <span className="chip chip-ok">Live</span>}
              {!isLoading && error && <span className="chip chip-error">Degraded</span>}
            </div>
            {error && <div className="error-banner">{error}</div>}
            {payload && !error && (
              <div className="summary-grid">
                {payload.location && payload.current && (
                  <div className="summary-metric">
                    <div className="metric-label">Temperature</div>
                    <div className="metric-value">
                      {payload.current.temperature}
                      <span className="metric-unit">
                        {units === "f" ? "°F" : units === "s" ? "K" : "°C"}
                      </span>
                    </div>
                    <div className="metric-caption">
                      Feels like {payload.current.feelslike}
                      {units === "f" ? "°F" : units === "s" ? "K" : "°C"} ·{" "}
                      {payload.current.weather_descriptions?.[0]}
                    </div>
                  </div>
                )}
                {payload.current && (
                  <>
                    <div className="summary-metric">
                      <div className="metric-label">Wind</div>
                      <div className="metric-value">
                        {payload.current.wind_speed}
                        <span className="metric-unit"> km/h</span>
                      </div>
                      <div className="metric-caption">
                        {payload.current.wind_dir} · {payload.current.wind_degree}°
                      </div>
                    </div>
                    <div className="summary-metric">
                      <div className="metric-label">Humidity</div>
                      <div className="metric-value">
                        {payload.current.humidity}
                        <span className="metric-unit">%</span>
                      </div>
                      <div className="metric-caption">
                        Cloud cover {payload.current.cloudcover}% · Visibility{" "}
                        {payload.current.visibility} km
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <aside className="glass-panel inspector">
          <div className="inspector-header">
            <div>
              <div className="inspector-title">Raw payload inspector</div>
              <div className="inspector-subtitle">
                Useful when wiring this into your own backend.
              </div>
            </div>
            <button className="secondary-btn" onClick={runQuery} disabled={isLoading}>
              Refresh
            </button>
          </div>
          <div className="inspector-body">
            {isLoading && <div className="inspector-placeholder">Streaming data…</div>}
            {!isLoading && !payload && !error && (
              <div className="inspector-placeholder">
                Run a query to see the JSON response body from weatherstack.
              </div>
            )}
            {!isLoading && error && (
              <pre className="inspector-pre">
                {JSON.stringify({ error }, null, 2)}
              </pre>
            )}
            {!isLoading && payload && (
              <pre className="inspector-pre">
                {JSON.stringify(payload, null, 2)}
              </pre>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};
