//UserDTO
export interface IUser {
  username: string
  displayName: string
  token: string
  image?: string
}

//for login or register request
export interface IUserFormValues {
  email: string
  password: string
  displayName?: string
  username?: string
}