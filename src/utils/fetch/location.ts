import axios from 'axios'
import wrapPromise from './wrapPromise'

export const fetchLocation = () => {
  return wrapPromise(
    fetch('https://geolocation-db.com/json/')
      .then(r => r.clone().json())
      .then(json => json.country_code)
      .catch(e => {
        console.error(e)
      })
  )
}

export const fetchUserLocation = () => {
  const token = Math.random() >= 0.5 ? '216dba11b76078' : '77291745f941d9'
  return axios.get(`https://ipinfo.io/?token=${token}`)
}
