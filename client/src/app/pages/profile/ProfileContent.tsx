import React from 'react'
import { Tab } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ProfilePhotos from './ProfilePhotos'
import ProfileDescription from './ProfileDescription'
import ProfileFollowing from './ProfileFollowing'
import ProfileActivities from './ProfileActivities'

interface IProps {
  setActiveTab: (activeIndex: any) => void
}

const panes = [
  { menuItem: 'About', render: () => <ProfileDescription /> },
  { menuItem: 'Photos', render: () => <ProfilePhotos /> },
  {
    menuItem: 'Activities',
    render: () => <ProfileActivities />,
  },
  {
    menuItem: 'Followers',
    render: () => <ProfileFollowing />,
  },
  {
    menuItem: 'Following',
    render: () => <ProfileFollowing />,
  },
]

const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)}
    />
  )
}

export default observer(ProfileContent)
