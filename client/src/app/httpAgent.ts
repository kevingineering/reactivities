import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { history } from '../index'
import { IUserFormValues, IUser } from './models/User'
import { IActivity } from './models/Activity'

//separate API calls from components
//this file defines all api calls

//base path - every call will start with this url
axios.defaults.baseURL = 'http://localhost:5000/api'

//for every response, catch errors if they exist
//takes two parameters - what to do when response is fulfilled, what to do when response is rejected
axios.interceptors.response.use(undefined, (error) => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network error - make sure API is running!')
  }
  const { status, config, data } = error.response
  if (status === 404) {
    history.push('/notfound')
  }

  //verification error if path requiring GUID is not sent GUID
  if (
    status === 400 &&
    config.method === 'get' &&
    data.errors.hasOwnProperty('id')
  ) {
    history.push('/notfound')
  }

  //check for internal server errors and display them with toastify
  if (status === 500) {
    toast.error('Server error - check the terminal for more info!')
  }

  throw error.response
})

//for every request, see if we have a token
//if token exists, add to headers
//first parameter let's you configure requests
//second is what to do if request is rejected
axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('jwt')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//store request in a constant
const responseBody = (response: AxiosResponse) => response.data

//adding delay to API for realism during development - currying function
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  )

//create a request object
const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
}

//activities requests
const Activities = {
  list: (): Promise<IActivity[]> => requests.get('/activities'),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post('/activities', activity),
  edit: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/attend/${id}`, {}),
  unattend: (id: string) => requests.del(`/activities/attend/${id}`)
}

//user requests
// methodName: (paramName?: paramType?): returnType => requests.method('/pathAddedToBaseURL', body?)
const Users = {
  currentUser: (): Promise<IUser> => requests.get('/user'),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post('/user/login', user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post('/user/register', user),
}

export default {
  Activities,
  Users,
}
