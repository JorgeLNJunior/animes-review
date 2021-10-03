import { AxiosInstance } from 'axios'

import { http } from './axios'

export interface User {
  uuid: string,
  name: string,
  email: string,
  password: string,
  avatar: string,
}

export interface UserForm {
  name: string,
  email: string,
  password: string,
}

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

  async register (form: UserForm) {
    const response = await this.axios.post('/register', form)
    return response.data.user as User
  }

  async confirmEmail (token: string) {
    await this.axios.post('/confirm', { token: token })
  }
}
