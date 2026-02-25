const BASE_URL = "https://api.weatherstack.com";

const ACCESS_KEY =
  import.meta.env.VITE_WEATHERSTACK_API_KEY ?? "dbdb7539a5283f825ed674751fb302bd";

type Units = "m" | "f" | "s";

export type WeatherMode = "current" | "forecast" | "historical" | "marine";

export interface WeatherRequestOptions {
  query: string;
  units?: Units;
  language?: string;
  // forecast
  forecastDays?: number;
  // historical
  date?: string;
  dateFrom?: string;
  dateTo?: string;
}

async function request<T>(endpoint: string, params: Record<string, string | number | undefined>): Promise<T> {
  const search = new URLSearchParams();
  search.set("access_key", ACCESS_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const url = `${BASE_URL}/${endpoint}?${search.toString()}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data && data.error) {
    const message: string =
      data.error.info || data.error.type || "Weatherstack request failed. Check your plan and parameters.";
    throw new Error(message);
  }

  return data as T;
}

export async function fetchCurrent(options: WeatherRequestOptions) {
  return request("current", {
    query: options.query,
    units: options.units,
    language: options.language
  });
}

export async function fetchForecast(options: WeatherRequestOptions) {
  return request("forecast", {
    query: options.query,
    units: options.units,
    language: options.language,
    forecast_days: options.forecastDays ?? 5,
    hourly: 1
  });
}

export async function fetchHistorical(options: WeatherRequestOptions) {
  return request("historical", {
    query: options.query,
    units: options.units,
    language: options.language,
    date: options.date,
    date_from: options.dateFrom,
    date_to: options.dateTo
  });
}

export async function fetchMarine(options: WeatherRequestOptions) {
  return request("marine", {
    query: options.query,
    units: options.units,
    language: options.language
  });
}

export async function searchLocations(query: string) {
  // weatherstack uses the same "query" parameter but a different endpoint for lookup
  return request("autocomplete", { query });
}
