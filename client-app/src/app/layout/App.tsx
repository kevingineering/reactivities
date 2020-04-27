import React from 'react'
import { Container } from 'semantic-ui-react'
import Navbar from '../../features/nav/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch,
} from 'react-router-dom'
import HomePage from '../../features/home/HomePage'
import ActivityForm from '../../features/activities/form/ActivityForm'
import ActivityDetails from '../../features/activities/details/ActivityDetails'
import NotFound from './NotFound'
import { ToastContainer } from 'react-toastify'

const App: React.FC<RouteComponentProps> = (props) => {
  return (
    <React.Fragment>
      <ToastContainer position='bottom-right'/>
      <Route exact path="/" component={HomePage} />
      {/* '/(.+) means a path with anything beyond '/' */}
      <Route
        path={'/(.+)'}
        render={() => (
          <React.Fragment>
            <Navbar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                {/* Note that you can pass an array for your route. Note also that we are using a key. A key forces a component to rerender even if nothing appears to have changed. Our key here is dependent on props. To get props, we need to use the HOC withRouter. All this allows us to update the form on the createActivity page so that it is empty when a user clicks the createActivity button after rerouting there from the /manage/:id page */}
                <Route
                  path={['/createActivity', '/manage/:id']}
                  component={ActivityForm}
                  key={props.location.key}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </React.Fragment>
        )}
      />
    </React.Fragment>
  )
}

export default withRouter(App)
