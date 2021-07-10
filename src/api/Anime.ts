import { AxiosInstance } from 'axios'

import { http } from './axios'

export interface Anime {
  uuid: string
  title: string
  synopsis: string
  cover: string
  trailer: string
  episodes: number
}

export class AnimeApi {
  private axios: AxiosInstance

  constructor () {
    this.axios = http
  }

  async find (): Promise<Anime[]> {
    const token = localStorage.getItem('token')
    const response = await this.axios.get('/animes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.animes as Anime[]
  }
}
