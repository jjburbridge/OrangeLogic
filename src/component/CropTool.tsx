import {useEffect, useRef, useState} from 'react'
import ReactCrop, {Crop as ToolCrop} from 'react-image-crop'
import {Crop} from './CustomImagePreview'

type props = {
  setCrop: (crop?: Crop) => void
  crop: Crop
  image: string
}

export const CropTool = ({setCrop, crop, image}: props) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [tempCrop, setTempCrop] = useState<ToolCrop>()
  useEffect(() => {
    if (!crop && !tempCrop) return

    if (!crop) {
      setTempCrop(undefined)
      return
    }

    setTempCrop({
      unit: '%',
      x: crop.left,
      y: crop.top,
      width: crop.width,
      height: crop.height,
    })
  }, [crop])
  return (
    <div style={{maxHeight: 400}}>
      <link href="https://unpkg.com/react-image-crop/dist/ReactCrop.css" rel="stylesheet" />
      <ReactCrop
        crop={tempCrop}
        onChange={(_, percentCrop) => {
          setTempCrop(percentCrop)
        }}
        onComplete={(_, completeCrop) => {
          console.log(completeCrop)
          setCrop({
            top: completeCrop.y,
            left: completeCrop.x,
            width: completeCrop.width,
            height: completeCrop.height,
          })
        }}
        style={{maxHeight: 400, objectFit: 'cover'}}
        // minHeight={100}
      >
        <img ref={imgRef} alt="Crop me" src={image} style={{maxWidth: '100%'}} />
      </ReactCrop>
    </div>
  )
}
