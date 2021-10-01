import { AxiosInstance } from 'axios'

import { http } from './axios'

export interface User {
  uuid: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserQuery {
  uuid?: string;
  name?: string;
  email?: string;
  take?: number;
  skip?: number;
}

export class UserApi {
  constructor () {
    this.axios = http
  }

  private axios: AxiosInstance

  async find (query?: UserQuery): Promise<User[]> {
    let q = ''
    if (query?.uuid) q = q + `uuid=${query?.uuid}&`
    if (query?.name) q = q + `title=${query?.name}&`
    if (query?.email) q = q + `title=${query?.email}&`
    if (query?.take) q = q + `take=${query?.take}&`
    if (query?.skip) q = q + `skip=${query?.skip}&`

    const token = localStorage.getItem('token')
    const response = await this.axios.get(`/users?${q}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.users as User[]
  }
}
