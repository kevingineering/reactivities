import React, { useContext } from 'react'
import { Segment, Header, Button, Image, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { RootStoreContext } from '../stores/rootStore'
import Login from './Login'
import Register from './Register'

const HomePage = () => {
  const rootStore = useContext(RootStoreContext)
  const { isLoggedIn, user } = rootStore.userStore
  const { openModal } = rootStore.modalStore

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        {isLoggedIn && user ? (
          <React.Fragment>
            <Header
              as="h2"
              inverted
              content={`Welcome back ${user.displayName}!`}
            />
            <Button as={Link} to="/activities" size="huge" inverted>
              Go to activities!
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Header as="h2" inverted content="Welcome to Reactivities" />
            <Button onClick={() => openModal(<Login />)} size="huge" inverted>
              Login
            </Button>
            <Button
              onClick={() => openModal(<Register />)}
              size="huge"
              inverted
            >
              Register
            </Button>
          </React.Fragment>
        )}
      </Container>
    </Segment>
  )
}

export default HomePage