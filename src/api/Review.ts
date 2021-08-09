import { AxiosInstance } from 'axios'

import { Anime } from './Anime'
import { http } from './axios'
import { User } from './User'

export interface Review {
  uuid: string;
  title: string;
  description: string;
  rating: number;
  user: User;
  anime: Anime;
}

export class ReviewApi {
  private axios: AxiosInstance;

  constructor () {
    this.axios = http
  }

  async findByAnimeUuid (animeUuid: string) {
    const token = localStorage.getItem('token')
    const response = await this.axios.get(`/reviews?animeUuid=${animeUuid}&take=10`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return response.data.reviews as Review[]
  }
}
