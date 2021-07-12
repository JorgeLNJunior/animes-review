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

export interface UpdateAnime {
  title?: string
  synopsis?: string
  trailer?: string
  episodes?: number
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
    if (query?.uuid) q = q + `uuid=${query?.uuid}&`
    if (query?.title) q = q + `title=${query?.title}&`
    if (query?.take) q = q + `take=${query?.take}&`
    if (query?.skip) q = q + `skip=${query?.skip}&`

    const token = localStorage.getItem('token')
    const response = await this.axios.get(`/animes?${q}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.animes as Anime[]
  }

  async update (uuid: string, anime: UpdateAnime) {
    const token = localStorage.getItem('token')
    await this.axios.patch(`/animes/${uuid}`, anime, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async delete (uuid: string) {
    const token = localStorage.getItem('token')
    await this.axios.delete(`/animes/${uuid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }
}
