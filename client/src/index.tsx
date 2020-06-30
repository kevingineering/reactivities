import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import dateFnsLocalizer from 'react-widgets-date-fns'
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-widgets/dist/css/react-widgets.css'
import 'semantic-ui-css/semantic.min.css'
import './styles.css'
import App from './app/App'
import ScrollToTop from './app/sharedComponents/ScrollToTop'

dateFnsLocalizer()

export const history = createBrowserHistory()

ReactDOM.render(
  <Router history={history}>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </Router>,
  document.getElementById('root')
)
