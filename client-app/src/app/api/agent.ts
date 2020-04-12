import axios, { AxiosResponse } from 'axios'
import { IActivity } from '../models/Activity'

//separate API calls from components
//this file defines all api calls

//base path - every call will start with this url
axios.defaults.baseURL = 'http://localhost:5000/api'

//store request in a constant
const responseBody = (response: AxiosResponse) => response.data

//adding delay to API for realism during development - currying function
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms))

//create a request object
const requests = {
  get: (url: string) =>
    axios
      .get(url)
      .then(sleep(1000))
      .then(responseBody),
  post: (url: string, body: {}) =>
    axios
      .post(url, body)
      .then(sleep(1000))
      .then(responseBody),
  put: (url: string, body: {}) =>
    axios
      .put(url, body)
      .then(sleep(1000))
      .then(responseBody),
  del: (url: string) =>
    axios
      .delete(url)
      .then(sleep(1000))
      .then(responseBody)
}

//activities requests
const Activities = {
  list: (): Promise<IActivity[]> => requests.get('/activities'),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post('/activities', activity),
  edit: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`)
}

export default {
  Activities
}
