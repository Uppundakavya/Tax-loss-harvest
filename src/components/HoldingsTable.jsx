import React from "react";

function HoldingsTable({
  holdings,
  selectedRows,
  handleCheckbox,
  handleSelectAll,
}) {
  return (
    <div className="table-container">
      <table className="holdings-table">
        <thead>
          <tr>
            <th className="checkbox-col">
              <input
                type="checkbox"
                checked={
                  holdings.length > 0 && selectedRows.length === holdings.length
                }
                onChange={handleSelectAll}
              />
            </th>
            <th>Asset</th>
            <th>Holdings</th>
            <th>Total Current Value</th>
            <th>Short-term</th>
            <th>Long-term</th>
            <th>Amount To Sell</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((item) => (
            <tr key={item.coin}>
              <td className="checkbox-col">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.coin)}
                  onChange={() => handleCheckbox(item.coin)}
                />
              </td>
              <td>
                <div className="asset-info">
                  <img
                    src={item.logo}
                    alt={item.coin}
                    className="table-logo"
                  />
                  <div className="asset-text">
                    <span className="asset-name">{item.coinName}</span>
                    <span className="asset-symbol">{item.coin}</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="stacked-cell">
                  <span className="main-value">{item.totalHolding} {item.coin}</span>
                </div>
              </td>
              <td>
                <div className="stacked-cell">
                  <span className="main-value">₹{item.currentPrice?.toLocaleString()}</span>
                </div>
              </td>
              <td>
                <div
                  className={`stacked-cell ${
                    item.stcg.gain >= 0 ? "text-green" : "text-red"
                  }`}
                >
                  <span className="main-value">
                    {item.stcg.gain >= 0 ? "+" : ""}₹{item.stcg.gain?.toLocaleString()}
                  </span>
                </div>
              </td>
              <td>
                <div
                  className={`stacked-cell ${
                    item.ltcg.gain >= 0 ? "text-green" : "text-red"
                  }`}
                >
                  <span className="main-value">
                    {item.ltcg.gain >= 0 ? "+" : ""}₹{item.ltcg.gain?.toLocaleString()}
                  </span>
                </div>
              </td>
              <td>
                <div className="amount-to-sell">
                  {selectedRows.includes(item.coin) ? (
                    <span className="sell-value">{item.totalHolding} {item.coin}</span>
                  ) : (
                    <span className="sell-dash">-</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HoldingsTable;