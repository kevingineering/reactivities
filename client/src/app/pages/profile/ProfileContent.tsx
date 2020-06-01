import React from 'react'
import { Tab } from 'semantic-ui-react'
import { IProfile } from '../../models/Profile'
import { observer } from 'mobx-react-lite'
import ProfilePhotos from './ProfilePhotos'

interface IProps {
  profile: IProfile
}

const panes = [
  { menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane> },
  { menuItem: 'Photos', render: () => <ProfilePhotos /> },
  {
    menuItem: 'Activities',
    render: () => <Tab.Pane>Activites content</Tab.Pane>,
  },
  {
    menuItem: 'Followers',
    render: () => <Tab.Pane>Followers content</Tab.Pane>,
  },
  {
    menuItem: 'Following',
    render: () => <Tab.Pane>Following content</Tab.Pane>,
  },
]

const ProfileContent: React.FC<IProps> = ({ profile }) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      activeIndex={1} //index starts with 'About' as 0
    />
  )
}

export default observer(ProfileContent)
