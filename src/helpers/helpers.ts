import { token } from '@api/token.interface'
import decode from 'jwt-decode'

export function hasModifyPermission (userUuid: string) {
  const token = localStorage.getItem('token')
  const authenticatedUser: token = decode(token as string)

  if (authenticatedUser.isAdmin) return true
  if (authenticatedUser.uuid === userUuid) return true
  return false
}
