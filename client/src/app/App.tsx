import React, { useContext, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import HomePage from './pages/HomePage'
import Navbar from './pages/general/Navbar'
import ActivityDashboard from './pages/activityDashboard/ActivityDashboard'
import ActivityDetails from './pages/activityDetails/ActivityDetails'
import ActivityCreate from './pages/ActivityCreate'
import NotFound from './pages/NotFound'
import { RootStoreContext } from './stores/rootStore'
import LoadingComponent from './sharedComponents/LoadingComponent'
import ModalContainer from './sharedComponents/ModalContainer'
import ProfilePage from './pages/profile/ProfilePage'

const App: React.FC<RouteComponentProps> = (props) => {
  const rootStore = useContext(RootStoreContext)
  const { isAppLoaded, setAppLoaded, token } = rootStore.commonStore
  const { getUser } = rootStore.userStore

  //check if token is in store
  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded())
    } else {
      setAppLoaded()
    }
  }, [getUser, setAppLoaded, token])

  if (!isAppLoaded) {
    return <LoadingComponent content="Loading app..." />
  }

  return (
    <React.Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route exact path="/" component={HomePage} />
      {/* '/(.+)' means a path with anything beyond '/' */}
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
                  component={ActivityCreate}
                  key={props.location.key}
                />
                <Route
                  exact
                  path="/profile/:userName"
                  component={ProfilePage}
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

export default withRouter(observer(App))
