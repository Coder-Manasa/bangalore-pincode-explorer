import { useState } from "react";
import "./App.css";

function App() {
  const [searchType, setSearchType] = useState("pincode");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchPostOffices = async () => {
    const value = query.trim();

    if (!value) {
      setError(
        searchType === "pincode"
          ? "Please enter a 6-digit pincode."
          : "Please enter an area name."
      );
      setResults([]);
      return;
    }

    if (searchType === "pincode" && !/^\d{6}$/.test(value)) {
      setError("Please enter a valid 6-digit pincode.");
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
            const API_BASE_URL = import.meta.env.DEV
        ? "http://localhost:5000"
        : "";

        const endpoint =
        searchType === "pincode"
            ? `${API_BASE_URL}/api/pincode/${value}`
            : `${API_BASE_URL}/api/postoffice/${encodeURIComponent(
                value
            )}`;

      const response = await fetch(endpoint);

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        setError(
          data.message || "No post offices found for your search."
        );
        return;
      }

      setResults(data.data || []);
    } catch (err) {
      setError(
        "Something went wrong while fetching data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setError("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchPostOffices();
    }
  };

  const selectSearchType = (type) => {
    setSearchType(type);
    setQuery("");
    setResults([]);
    setError("");
  };

  /* -----------------------------
     RESULT STATISTICS
  ----------------------------- */

  const deliveryCount = results.filter(
    (office) => office.DeliveryStatus === "Delivery"
  ).length;

  const districts = [
    ...new Set(
      results
        .map((office) => office.District)
        .filter(Boolean)
    ),
  ];

  const states = [
    ...new Set(
      results
        .map((office) => office.State)
        .filter(Boolean)
    ),
  ];

  const pinCodes = [
    ...new Set(
      results
        .map((office) => office.Pincode)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-container">

          <div className="brand">
            <div className="brand-icon">📍</div>

            <div>
              <h1>Bangalore Pincode Explorer</h1>
              <p>Explore Bengaluru postal information</p>
            </div>
          </div>

          <div className="nav-badge">
            Postal Directory
          </div>

        </div>
      </header>

      <main>

        {/* HERO */}
        <section className="hero">
          <div className="hero-content">

            <span className="eyebrow">
              BENGALURU POSTAL DIRECTORY
            </span>

            <h2>
              Find post offices
              <br />
              <span>by Pincode or Area</span>
            </h2>

            <p className="hero-description">
              Quickly find Bangalore post offices, pincodes,
              delivery information, districts and other postal
              details.
            </p>

            {/* SEARCH */}
            <div className="search-card">

              <div className="search-tabs">

                <button
                  className={
                    searchType === "pincode"
                      ? "search-tab active"
                      : "search-tab"
                  }
                  onClick={() => selectSearchType("pincode")}
                >
                  <span>🔢</span>
                  Pincode
                </button>

                <button
                  className={
                    searchType === "area"
                      ? "search-tab active"
                      : "search-tab"
                  }
                  onClick={() => selectSearchType("area")}
                >
                  <span>📍</span>
                  Area Name
                </button>

              </div>

              <div className="search-row">

                <div className="input-wrapper">

                  <span className="input-icon">
                    {searchType === "pincode"
                      ? "🔢"
                      : "📍"}
                  </span>

                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      searchType === "pincode"
                        ? "Enter 6-digit pincode e.g. 560001"
                        : "Enter area name e.g. Indiranagar"
                    }
                    maxLength={
                      searchType === "pincode"
                        ? 6
                        : 60
                    }
                  />

                </div>

                <button
                  className="search-button"
                  onClick={searchPostOffices}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Searching
                    </>
                  ) : (
                    <>
                      Search
                      <span>→</span>
                    </>
                  )}
                </button>

                <button
                  className="clear-button"
                  onClick={clearSearch}
                  disabled={
                    !query &&
                    !results.length &&
                    !error
                  }
                >
                  Clear
                </button>

              </div>

              {error && (
                <div className="error-message">
                  <span>⚠</span>
                  {error}
                </div>
              )}

            </div>
          </div>
        </section>

        {/* FEATURES */}
        {!results.length &&
          !loading &&
          !error && (
            <section className="features">

              <div className="feature-card">
                <div className="feature-icon">🔎</div>

                <h3>Easy Search</h3>

                <p>
                  Search using a Bangalore pincode
                  or area name.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🏤</div>

                <h3>Post Office Details</h3>

                <p>
                  View important postal information
                  in one place.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📱</div>

                <h3>Responsive Design</h3>

                <p>
                  Access the application comfortably
                  on any device.
                </p>
              </div>

            </section>
          )}

        {/* LOADING */}
        {loading && (
          <section className="loading-section">

            <div className="large-spinner"></div>

            <h3>
              Finding post offices...
            </h3>

            <p>
              Please wait while we fetch the
              latest information.
            </p>

          </section>
        )}

        {/* RESULTS */}
        {!loading &&
          results.length > 0 && (
            <section className="results-section">

              {/* RESULT HEADER */}
              <div className="results-header">

                <div>
                  <span className="section-label">
                    SEARCH RESULTS
                  </span>

                  <h2>
                    Post Offices Found
                  </h2>
                </div>

                <div className="result-count">
                  {results.length}{" "}
                  {results.length === 1
                    ? "result"
                    : "results"}
                </div>

              </div>

              {/* SUMMARY */}
              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon">
                    🏤
                  </div>

                  <div>
                    <span>Total Offices</span>

                    <strong>
                      {results.length}
                    </strong>
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon delivery-icon">
                    🚚
                  </div>

                  <div>
                    <span>Delivery Offices</span>

                    <strong>
                      {deliveryCount}
                    </strong>
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    📍
                  </div>

                  <div>
                    <span>Pincodes</span>

                    <strong>
                      {pinCodes.length}
                    </strong>
                  </div>

                </div>

                <div className="stat-card">

                  <div className="stat-icon">
                    🗺️
                  </div>

                  <div>
                    <span>District</span>

                    <strong>
                      {districts.length === 1
                        ? districts[0]
                        : `${districts.length} districts`}
                    </strong>
                  </div>

                </div>

              </div>

              {/* LOCATION SUMMARY */}
              <div className="location-summary">

                <div className="location-summary-icon">
                  📍
                </div>

                <div>

                  <span>
                    SEARCHED LOCATION
                  </span>

                  <strong>
                    {query}
                  </strong>

                  <p>
                    {districts.length > 0 &&
                      districts.join(", ")}

                    {states.length > 0 &&
                      ` • ${states.join(", ")}`}
                  </p>

                </div>

              </div>

              {/* CARDS */}
              <div className="results-grid">

                {results.map((office, index) => (
                  <article
                    className="office-card"
                    key={`${office.Name}-${index}`}
                  >

                    <div className="card-top">

                      <div className="office-icon">
                        🏤
                      </div>

                      <span
                        className={
                          office.DeliveryStatus ===
                          "Delivery"
                            ? "status delivery"
                            : "status non-delivery"
                        }
                      >
                        {office.DeliveryStatus}
                      </span>

                    </div>

                    <h3>
                      {office.Name}
                    </h3>

                    <div className="office-details">

                      <div className="detail-row">
                        <span>PIN Code</span>

                        <strong>
                          {office.Pincode}
                        </strong>
                      </div>

                      <div className="detail-row">
                        <span>District</span>

                        <strong>
                          {office.District}
                        </strong>
                      </div>

                      <div className="detail-row">
                        <span>State</span>

                        <strong>
                          {office.State}
                        </strong>
                      </div>

                      <div className="detail-row">
                        <span>Office Type</span>

                        <strong>
                          {office.BranchType}
                        </strong>
                      </div>

                      <div className="detail-row">
                        <span>Circle</span>

                        <strong>
                          {office.Circle}
                        </strong>
                      </div>

                    </div>

                  </article>
                ))}

              </div>

            </section>
          )}

      </main>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-content">

          <div>

            <strong>
              Bangalore Pincode Explorer
            </strong>

            <p>
              A full-stack web application for
              exploring Bangalore postal information.
            </p>

          </div>

          <div className="footer-tech">
            <span>React</span>
            <span>Node.js</span>
            <span>Express</span>
            <span>REST API</span>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 Bangalore Pincode Explorer ·
          Built for educational purposes
        </div>

      </footer>

    </div>
  );
}

export default App;