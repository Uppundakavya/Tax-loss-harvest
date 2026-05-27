import { useEffect, useState } from "react";
import "./App.css";
import { fetchHoldings } from "./api/holdingsApi";
import { fetchCapitalGains } from "./api/capitalGainsApi";
import HoldingsTable from "./components/HoldingsTable";
import { calculateHarvesting } from "./utils/calculateHarvesting";
import { formatCurrency } from "./utils/formatCurrency";

function App() {
  const [holdings, setHoldings] = useState([]);
  const [capitalGains, setCapitalGains] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const holdingsData = await fetchHoldings();
      const gainsData = await fetchCapitalGains();
      setHoldings(holdingsData);
      setCapitalGains(gainsData);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckbox = (coin) => {
    if (selectedRows.includes(coin)) {
      const filteredRows = selectedRows.filter((item) => item !== coin);
      setSelectedRows(filteredRows);
    } else {
      setSelectedRows([...selectedRows, coin]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === holdings.length) {
      setSelectedRows([]);
    } else {
      const allCoins = holdings.map((item) => item.coin);
      setSelectedRows(allCoins);
    }
  };

  const selectedHoldings = holdings.filter((item) =>
    selectedRows.includes(item.coin),
  );

  const harvestedData = capitalGains
    ? calculateHarvesting(capitalGains, selectedHoldings)
    : null;

  const preSTCG = capitalGains
    ? capitalGains.stcg.profits - capitalGains.stcg.losses
    : 0;
  const preLTCG = capitalGains
    ? capitalGains.ltcg.profits - capitalGains.ltcg.losses
    : 0;
  const preRealised = preSTCG + preLTCG;

  const postSTCG = harvestedData
    ? harvestedData.stcg.profits - harvestedData.stcg.losses
    : 0;
  const postLTCG = harvestedData
    ? harvestedData.ltcg.profits - harvestedData.ltcg.losses
    : 0;
  const postRealised = postSTCG + postLTCG;

  const savings = preRealised - postRealised;

  const sortedHoldings = [...holdings];

  if (sortOrder === "asc") {
    sortedHoldings.sort((a, b) => a.stcg.gain - b.stcg.gain);
  }
  if (sortOrder === "desc") {
    sortedHoldings.sort((a, b) => b.stcg.gain - a.stcg.gain);
  }

  const visibleHoldings = showAll ? sortedHoldings : sortedHoldings.slice(0, 5);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      {/* Top Header matching Figma */}
      <div className="title-section">
        <h1 className="title">Tax Harvesting</h1>
        <span className="badge">Beta</span>
      </div>

      <div className="disclaimer-banner">
        <span>ⓘ</span> Important Notes & Disclaimers
      </div>

      <div className="cards-container">
        {/* Pre Harvesting Card */}
        <div className="summary-card">
          <h2 className="card-title">Pre Harvesting</h2>

          <div className="stats-grid">
            <div></div>
            <div className="grid-header">Short-term</div>
            <div className="grid-header">Long-term</div>

            <div className="grid-label">Profits</div>
            <div className="grid-value">
              {formatCurrency(capitalGains?.stcg.profits)}
            </div>
            <div className="grid-value">
              {formatCurrency(capitalGains?.ltcg.profits)}
            </div>

            <div className="grid-label">Losses</div>
            <div className="grid-value text-red">
              -{formatCurrency(Math.abs(capitalGains?.stcg.losses || 0))}
            </div>
            <div className="grid-value text-red">
              -{formatCurrency(Math.abs(capitalGains?.ltcg.losses || 0))}
            </div>

            <div className="grid-label border-top">Net Capital Gains</div>
            <div className="grid-value border-top">
              {formatCurrency(preSTCG)}
            </div>
            <div className="grid-value border-top">
              {formatCurrency(preLTCG)}
            </div>
          </div>

          <div className="realised-gains">
            <span>Realised Capital Gains</span>
            <span>{formatCurrency(preRealised)}</span>
          </div>
        </div>

        {/* After Harvesting Card */}
        <div className="summary-card blue-card">
          <h2 className="card-title">After Harvesting</h2>

          <div className="stats-grid">
            <div></div>
            <div className="grid-header">Short-term</div>
            <div className="grid-header">Long-term</div>

            <div className="grid-label">Profits</div>
            <div className="grid-value">
              {formatCurrency(harvestedData?.stcg.profits)}
            </div>
            <div className="grid-value">
              {formatCurrency(harvestedData?.ltcg.profits)}
            </div>

            <div className="grid-label">Losses</div>
            <div className="grid-value text-red">
              -{formatCurrency(Math.abs(harvestedData?.stcg.losses || 0))}
            </div>
            <div className="grid-value text-red">
              -{formatCurrency(Math.abs(harvestedData?.ltcg.losses || 0))}
            </div>

            <div className="grid-label border-top">Net Capital Gains</div>
            <div className="grid-value border-top">
              {formatCurrency(postSTCG)}
            </div>
            <div className="grid-value border-top">
              {formatCurrency(postLTCG)}
            </div>
          </div>

          <div className="realised-gains">
            <span>Realised Capital Gains</span>
            <span>{formatCurrency(postRealised)}</span>
          </div>

          {savings > 0 && (
            <div className="savings-banner">
              <span>💡</span> You are going to save taxes:{" "}
              {formatCurrency(savings)}
            </div>
          )}
        </div>
      </div>

      <div className="table-header">
        <h3 style={{ marginBottom: "16px" }}>Holdings</h3>
      </div>

      <HoldingsTable
        holdings={visibleHoldings}
        selectedRows={selectedRows}
        handleCheckbox={handleCheckbox}
        handleSelectAll={handleSelectAll}
      />
    </div>
  );
}

export default App;
