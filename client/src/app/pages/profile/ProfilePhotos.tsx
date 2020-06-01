import React, { useContext, useState } from 'react'
import { Tab, Header, Card, Image, Button, Grid } from 'semantic-ui-react'
import { RootStoreContext } from '../../stores/rootStore'
import { observer } from 'mobx-react-lite'
import PhotoUploadWidget from './photoUpload/PhotoUploadWidget'

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext)
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    isUploadingPhoto,
    setMainPhoto,
    isSettingMain,
    deletePhoto,
    isDeletingPhoto,
  } = rootStore.profileStore

  const [isAddPhotoMode, setIsAddPhotoMode] = useState(false)
  const [target, setTarget] = useState<string | undefined>()

  const handleUploadPhoto = async (image: Blob) => {
    await uploadPhoto(image)
    setIsAddPhotoMode((prevState) => !prevState)
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={isAddPhotoMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setIsAddPhotoMode((prevState) => !prevState)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {isAddPhotoMode ? (
            <PhotoUploadWidget
              handleUploadPhoto={handleUploadPhoto}
              isUploadingPhoto={isUploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url} alt={photo.url} />
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button
                          name={photo.id}
                          basic
                          positive
                          disabled={photo.isMain}
                          content="Main"
                          onClick={(e) => {
                            setTarget(e.currentTarget.name)
                            setMainPhoto(photo)
                          }}
                          loading={isSettingMain && target === photo.id}
                        />
                        <Button
                          name={photo.id}
                          basic
                          negative
                          disabled={photo.isMain}
                          icon="trash"
                          onClick={(e) => {
                            setTarget(e.currentTarget.name)
                            deletePhoto(photo)
                          }}
                          loading={isDeletingPhoto && target === photo.id}
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
}

export default observer(ProfilePhotos)
