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

export interface ReviewForm {
  anime: string,
  title: string;
  description: string;
  rating: number;
}

export interface ReviewQuery {
  uuid?: string;
  animeUuid?: string;
  userUuid?: string;
  take?: number;
  skip?: number;
}

export class ReviewApi {
  private axios: AxiosInstance;

  constructor () {
    this.axios = http
  }

  async find (query: ReviewQuery) {
    const token = localStorage.getItem('token')

    let q = ''
    if (query.uuid) q += `uuid=${query.uuid}&&`
    if (query.animeUuid) q += `animeUuid=${query.animeUuid}&&`
    if (query.userUuid) q += `userUuid=${query.userUuid}&&`
    if (query.skip) q += `skip=${query.skip}&&`
    if (query.take) q += `take=${query.take}`

    const response = await this.axios.get(`/reviews?${q}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return response.data.reviews as Review[]
  }

  async create (form: ReviewForm) {
    form.rating = Number(form.rating)

    const token = localStorage.getItem('token')
    const response = await this.axios.post('/reviews', form, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return response.data.review as Review
  }
}
