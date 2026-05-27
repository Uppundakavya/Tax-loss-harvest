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

         <th>

  <input
    type="checkbox"

    checked={
      holdings.length > 0 &&
      selectedRows.length ===
      holdings.length
    }

    onChange={handleSelectAll}
  />

</th>

          <th>Asset</th>

          <th>Holdings</th>

          <th>Current Price</th>

          <th>STCG</th>

          <th>LTCG</th>

          <th>Amount To Sell</th>

        </tr>

      </thead>

      <tbody>

        {
          holdings.map((item) => (

            <tr key={item.coin}>

              <td>

                <input
                  type="checkbox"

                  checked={
                    selectedRows.includes(item.coin)
                  }

                  onChange={() =>
                    handleCheckbox(item.coin)
                  }
                />

              </td>

              <td>

                <div className="asset-info">

                  <img
                    src={item.logo}
                    alt={item.coin}
                    className="table-logo"
                  />

                  <div>

                    <h4>{item.coin}</h4>

                    <p>{item.coinName}</p>

                  </div>

                </div>

              </td>

              <td>

                {item.totalHolding}

              </td>

              <td>

                ₹{item.currentPrice}

              </td>

              <td
  className={
    item.stcg.gain >= 0
      ? "profit"
      : "loss"
  }
>

  ₹{item.stcg.gain}

</td>

              <td
  className={
    item.ltcg.gain >= 0
      ? "profit"
      : "loss"
  }
>

  ₹{item.ltcg.gain}

</td>

              <td>

                {
                  selectedRows.includes(item.coin)
                    ? item.totalHolding
                    : "-"
                }

              </td>

            </tr>

          ))
        }

      </tbody>

   </table>

</div>

)
}

export default HoldingsTable