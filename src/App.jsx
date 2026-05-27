import { useEffect, useState } from "react"

import "./App.css"

import { fetchHoldings } from "./api/holdingsApi"

import { fetchCapitalGains } from "./api/capitalGainsApi"

import HoldingsTable from "./components/HoldingsTable"

import { calculateHarvesting }
from "./utils/calculateHarvesting"

import { formatCurrency }
from "./utils/formatCurrency"

function App() {

  const [holdings, setHoldings] =
    useState([])

  const [capitalGains, setCapitalGains] =
    useState(null)

  const [selectedRows, setSelectedRows] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [showAll, setShowAll] =
    useState(false)
  const [sortOrder, setSortOrder] =
  useState("")

  useEffect(() => {

    loadData()

  }, [])

  const loadData = async () => {

    try {

      setLoading(true)

      const holdingsData =
        await fetchHoldings()

      const gainsData =
        await fetchCapitalGains()

      setHoldings(holdingsData)

      setCapitalGains(gainsData)

    } catch (err) {

      setError(
        "Failed to load data"
      )

    } finally {

      setLoading(false)

    }

  }

  const handleCheckbox = (coin) => {

    if (selectedRows.includes(coin)) {

      const filteredRows =
        selectedRows.filter(
          (item) => item !== coin
        )

      setSelectedRows(filteredRows)

    } else {

      setSelectedRows([
        ...selectedRows,
        coin,
      ])

    }

  }

  const handleSelectAll = () => {

    if (
      selectedRows.length ===
      holdings.length
    ) {

      setSelectedRows([])

    } else {

      const allCoins =
        holdings.map(
          (item) => item.coin
        )

      setSelectedRows(allCoins)

    }

  }

  const selectedHoldings =
    holdings.filter(
      (item) =>
        selectedRows.includes(item.coin)
    )

  const harvestedData =
    capitalGains
      ? calculateHarvesting(
          capitalGains,
          selectedHoldings
        )
      : null

  const preSTCG =
    capitalGains
      ? capitalGains.stcg.profits -
        capitalGains.stcg.losses
      : 0

  const preLTCG =
    capitalGains
      ? capitalGains.ltcg.profits -
        capitalGains.ltcg.losses
      : 0

  const preRealised =
    preSTCG + preLTCG

  const postSTCG =
    harvestedData
      ? harvestedData.stcg.profits -
        harvestedData.stcg.losses
      : 0

  const postLTCG =
    harvestedData
      ? harvestedData.ltcg.profits -
        harvestedData.ltcg.losses
      : 0

  const postRealised =
    postSTCG + postLTCG

  const savings =
    preRealised - postRealised

 const sortedHoldings = [...holdings]

if (sortOrder === "asc") {

  sortedHoldings.sort(
    (a, b) =>
      a.stcg.gain - b.stcg.gain
  )

}

if (sortOrder === "desc") {

  sortedHoldings.sort(
    (a, b) =>
      b.stcg.gain - a.stcg.gain
  )

}

const visibleHoldings =
  showAll
    ? sortedHoldings
    : sortedHoldings.slice(0, 5)

  if (loading) {

    return (

      <div className="loader">

        Loading...

      </div>

    )

  }

  if (error) {

    return (

      <div className="error">

        {error}

      </div>

    )

  }

  return (

    <div className="container">

      <h1 className="title">
        Tax Loss Harvesting
      </h1>
      <h2>VERCEL UPDATE TEST</h2>
      
      <a href="https://github.com/Nookalasaimeghana23/tax-loss-harvesting-project"

     target="_blank">


  <button className="github-btn">

    View Source Code

  </button>

</a>

      <div className="cards-container">

        <div className="summary-card">

          <h2>Pre Harvesting</h2>

          <p>
            STCG Profit:
            {" "}
            {formatCurrency(
              capitalGains?.stcg.profits
            )}
          </p>

          <p>
            STCG Loss:
            {" "}
            {formatCurrency(
              capitalGains?.stcg.losses
            )}
          </p>

          <p>
            LTCG Profit:
            {" "}
            {formatCurrency(
              capitalGains?.ltcg.profits
            )}
          </p>

          <p>
            LTCG Loss:
            {" "}
            {formatCurrency(
              capitalGains?.ltcg.losses
            )}
          </p>

          <h3>
            Realised Capital Gains:
            {" "}
            {formatCurrency(preRealised)}
          </h3>

        </div>

        <div className="summary-card blue-card">

          <h2>After Harvesting</h2>

          <p>
            STCG Profit:
            {" "}
            {formatCurrency(
              harvestedData?.stcg.profits
            )}
          </p>

          <p>
            STCG Loss:
            {" "}
            {formatCurrency(
              harvestedData?.stcg.losses
            )}
          </p>

          <p>
            LTCG Profit:
            {" "}
            {formatCurrency(
              harvestedData?.ltcg.profits
            )}
          </p>

          <p>
            LTCG Loss:
            {" "}
            {formatCurrency(
              harvestedData?.ltcg.losses
            )}
          </p>

          <h3>
            Realised Capital Gains:
            {" "}
            {formatCurrency(postRealised)}
          </h3>

          {
  savings > 0 && (

    <p className="savings">

      You're going to save
      {" "}
      {formatCurrency(savings)}

    </p>

  )
}

{
  savings < 0 && (

    <p className="profit-message">

      You're making extra profit of
      {" "}
      {formatCurrency(
        Math.abs(savings)
      )}

    </p>

  )
}

        </div>

      </div>
      <div className="sort-container">

  <label>
    Sort Short-Term Gain:
  </label>

  <select
    value={sortOrder}

    onChange={(e) =>
      setSortOrder(e.target.value)
    }
  >

    <option value="">
      Default
    </option>

    <option value="asc">
      Ascending
    </option>

    <option value="desc">
      Descending
    </option>

  </select>

</div>
      <HoldingsTable
        holdings={visibleHoldings}
        selectedRows={selectedRows}
        handleCheckbox={handleCheckbox}
        handleSelectAll={handleSelectAll}
      />

      <div className="view-all-container">

        <button
          className="view-btn"

          onClick={() =>
            setShowAll(!showAll)
          }
        >

          {
            showAll
              ? "Show Less"
              : "View All"
          }

        </button>

      </div>

    </div>

  )

}

export default App