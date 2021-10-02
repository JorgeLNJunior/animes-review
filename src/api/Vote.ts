import { AxiosInstance } from 'axios'

import { http } from './axios'
import { Review } from './Review'
import { User } from './User'

export interface Vote {
  uuid: string;
  name: string;
  review: Review,
  user: User,
  createdAt: string;
  updatedAt: string;
}

export interface VoteQuery {
  uuid?: string;
  reviewUuid?: string;
  userUuid?: string;
  take?: number;
  skip?: number;
}

export class VoteApi {
  constructor () {
    this.axios = http
  }

  private axios: AxiosInstance

  async find (query: VoteQuery) {
    const token = localStorage.getItem('token')

    let q = ''
    if (query.uuid) q += `uuid=${query.uuid}&&`
    if (query.reviewUuid) q += `reviewUuid=${query.reviewUuid}&&`
    if (query.userUuid) q += `userUuid=${query.userUuid}&&`
    if (query.skip) q += `skip=${query.skip}&&`
    if (query.take) q += `take=${query.take}`

    const response = await this.axios.get(`/votes?${q}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return {
      votes: response.data.votes as Vote[],
      pageTotal: response.data.pageTotal as number,
      total: response.data.total as number
    }
  }

  async vote (reviewUuid: string): Promise<Vote> {
    const token = localStorage.getItem('token')
    const response = await this.axios.post('/votes', {
      reviewUuid: reviewUuid
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.vote as Vote
  }

  async delete (reviewUuid: string): Promise<void> {
    const token = localStorage.getItem('token')
    await this.axios.delete(`/votes/${reviewUuid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }
}
