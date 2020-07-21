//UserDTO
export interface IUser {
  userName: string
  displayName: string
  refreshToken: string
  token: string
  image?: string
}

//for login or register request
export interface IUserFormValues {
  email: string
  password: string
  displayName?: string
  userName?: string
}
