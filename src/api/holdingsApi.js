import holdings from "../data/holdings"

export const fetchHoldings = () => {

  return new Promise((resolve) => {

    setTimeout(() => {

      resolve(holdings)

    }, 1000)

  })

}