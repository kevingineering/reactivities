import React, { Fragment, useState, useEffect } from 'react'
import { Header, Grid, Button } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import PhotoWidgetDropzone from './PhotoWidgetDropzone'
import PhotoWidgetCropper from './PhotoWidgetCropper'

interface IProps {
  handleUploadPhoto: (file: Blob) => void
  isUploadingPhoto: boolean
}

const PhotoUploadWidget: React.FC<IProps> = ({
  handleUploadPhoto,
  isUploadingPhoto,
}) => {
  //any[] here is cheating to get around typescript error
  const [files, setFiles] = useState<any[]>([])
  const [image, setImage] = useState<Blob | null>(null)

  //clear files before leaving
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
    //eslint-disable-next-line
  }, [])

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color="teal" sub content="Step 1 - Add Photo" />
          <PhotoWidgetDropzone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 2 - Resize image" />
          {files.length > 0 && (
            <PhotoWidgetCropper
              setImage={setImage}
              imagePreview={files[0].preview}
            />
          )}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 3 - Preview & Upload" />
          {files.length > 0 && (
            <React.Fragment>
              <div
                className="img-preview"
                style={{ minHeight: '200px', overflow: 'hidden' }}
              />
              <Button.Group widths={2}>
                <Button
                  positive
                  icon="check"
                  loading={isUploadingPhoto}
                  onClick={() => image && handleUploadPhoto(image)}
                />
                <Button
                  negative
                  icon="close"
                  disabled={isUploadingPhoto}
                  onClick={() => setFiles([])}
                />
              </Button.Group>
            </React.Fragment>
          )}
        </Grid.Column>
      </Grid>
    </Fragment>
  )
}

export default observer(PhotoUploadWidget)
