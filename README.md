## StratoCast – Weatherstack SaaS Console

StratoCast is a single-page React SaaS console built on top of the Weatherstack API. It provides a glassmorphic dashboard for current, forecast, historical and marine weather, plus location search with suggestions.

### Tech stack

- **React 18 + TypeScript**
- **Vite** for dev/build
- **Vanilla CSS** for the glassmorphic UI

### Weatherstack configuration

- **Base URL**: `https://api.weatherstack.com`
- **Key used by default**: `dbdb7539a5283f825ed674751fb302bd` (as provided in the prompt).
- For production use, create a `.env` file in the project root and set:

```bash
VITE_WEATHERSTACK_API_KEY=your_own_key_here
```

The app reads `VITE_WEATHERSTACK_API_KEY` first and falls back to the bundled key if missing.

> Important: Exposing API keys in frontend code is not secure. Treat this as a demo and move the key to a backend proxy for real SaaS deployments.

### Features

- **Current weather**: Real-time conditions including temperature, feels-like, wind, humidity and visibility.
- **Forecast**: Configurable forecast horizon (1–14 days) with unit switching (metric, Fahrenheit, scientific).
- **Historical**: Switch between a **single day** or a **date range**, then query historical weather for that window.
- **Marine**: Marine endpoint hook for coastal / offshore conditions (subject to your Weatherstack plan).
- **Location search**:
  - Free text city/IP/lat-long search bar.
  - Autocomplete-style suggestions using the Weatherstack location lookup endpoint.
  - Search + filter area designed as a glassmorphic control strip at the top of the dashboard.
- **Payload inspector**:
  - Right-side panel that prints the raw JSON response.
  - Helpful when you want to re-use this UI as a reference while building your own backend.

Note: Some endpoints (forecast, historical, marine, bulk queries) may be restricted on free Weatherstack tiers. When a feature is not available, the API will return an error JSON which is surfaced in the UI.

### Running the app locally

1. **Install dependencies**:

```bash
cd weather
npm install
```

2. **(Optional) Configure your own key**:

```bash
echo VITE_WEATHERSTACK_API_KEY=your_own_key_here > .env
```

3. **Start the dev server**:

```bash
npm run dev
```

Then open the URL printed in the terminal (by default `http://localhost:5173`).

### Design notes

- Dark, **glassmorphic** layout with:
  - Blurred, translucent cards.
  - Radial gradients on the main canvas.
  - Subtle, high-contrast but realistic SaaS color accents (custom palette, not taken from a design library).
- Layout favors:
  - **Search and filters** at the top.
  - **Metrics summary** in the center.
  - **JSON inspector** on the right for developer-focused workflows.

