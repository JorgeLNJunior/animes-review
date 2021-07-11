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

export interface AnimeQuery {
  uuid?: string;
  title?: string;
  take?: number;
  skip?: number;
}

export class AnimeApi {
  private axios: AxiosInstance

  constructor () {
    this.axios = http
  }

  async find (query?: AnimeQuery): Promise<Anime[]> {
    let q = ''
    if (query?.title) q = q + `title=${query?.title}&`
    if (query?.take) q = q + `take=${query?.take}&`
    if (query?.skip) q = q + `skip=${query?.skip}&`

    const token = localStorage.getItem('token')
    const response = await this.axios.get(`/animes?${q}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.animes as Anime[]
  }
}
