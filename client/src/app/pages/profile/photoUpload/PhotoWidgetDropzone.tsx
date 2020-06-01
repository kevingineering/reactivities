import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Icon, Header } from 'semantic-ui-react'

interface IProps {
  setFiles: (files: object[]) => void
}

const dropzoneStyles = {
  border: 'dashed 3px #eee',
  borderColor: '#eee',
  borderRadius: '5px',
  paddingTop: '30px',
  textAlign: 'center' as 'center', //error workaround
  height: '200px',
}

const dropzoneActive = {
  borderColor: 'green',
}
const PhotoWidgetDropzone: React.FC<IProps> = ({ setFiles }) => {
  const onDrop = useCallback((acceptedFiles) => {
    //create local file and assign preview property to each file in array
    setFiles(
      acceptedFiles.map((file: object) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    )
    //eslint-disable-next-line
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      style={
        isDragActive
          ? { ...dropzoneStyles, ...dropzoneActive }
          : dropzoneStyles
      }
    >
      <input {...getInputProps()} />
      <Icon name='upload' size='huge'/>
      <Header content='Drop image here' />
    </div>
  )
}

export default PhotoWidgetDropzone
