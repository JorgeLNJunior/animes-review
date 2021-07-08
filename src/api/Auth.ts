import { AxiosInstance } from 'axios'

import { http } from './axios'

export class Auth {
  private axios: AxiosInstance

  constructor () {
    this.axios = http
  }

  async Login (email: string, password: string): Promise<string> {
    const response = await this.axios.post('/login', {
      email: email,
      password: password
    })
    return response.data.token as string
  }
}
