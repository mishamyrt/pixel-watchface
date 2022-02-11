import { singletonFrom } from '../utilities'

function postJson (url: string, data: object) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export class APIService {
  async render (color: string) {
    const res = await postJson('/render', { color })
    if (![200, 301].includes(res.status)) {
      throw new Error('Could not render watch face')
    }
    return res.blob()
  }
}

export const API = singletonFrom(APIService)
