import capitalGains from "../data/capitalGains"

export const fetchCapitalGains = () => {

  return new Promise((resolve) => {

    setTimeout(() => {

      resolve(capitalGains)

    }, 1000)

  })

}