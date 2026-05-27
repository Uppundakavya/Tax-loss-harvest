export const calculateHarvesting = (
  capitalGains,
  selectedHoldings
) => {

  const updatedData = {

    stcg: {
      profits: capitalGains.stcg.profits,
      losses: capitalGains.stcg.losses,
    },

    ltcg: {
      profits: capitalGains.ltcg.profits,
      losses: capitalGains.ltcg.losses,
    },

  }

  selectedHoldings.forEach((holding) => {

    const stcgGain = holding.stcg.gain

    const ltcgGain = holding.ltcg.gain

    if (stcgGain > 0) {

      updatedData.stcg.profits += stcgGain

    } else {

      updatedData.stcg.losses +=
        Math.abs(stcgGain)

    }

    if (ltcgGain > 0) {

      updatedData.ltcg.profits += ltcgGain

    } else {

      updatedData.ltcg.losses +=
        Math.abs(ltcgGain)

    }

  })

  return updatedData

}