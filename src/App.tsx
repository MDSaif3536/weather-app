import { WeatherDashboard } from "./components/WeatherDashboard";

export const App = () => {
  return (
    <div className="app-root">
      <header className="app-header glass-panel">
        <div className="app-brand">
          <span className="app-logo">SC</span>
          <div>
            <div className="app-title">StratoCast</div>
            <div className="app-subtitle">Weather intelligence for modern teams</div>
          </div>
        </div>
        <nav className="app-nav">
          <span className="nav-pill nav-pill-active">Dashboard</span>
          <span className="nav-pill">Usage</span>
          <span className="nav-pill">Settings</span>
        </nav>
      </header>
      <main className="app-main">
        <WeatherDashboard />
      </main>
      <footer className="app-footer">
        <span>Powered by weatherstack</span>
        <span>Demo SaaS interface — not for production trading or aviation.</span>
      </footer>
    </div>
  );
};
