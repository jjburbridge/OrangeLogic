import {EllipsisHorizontalIcon, ResetIcon} from '@sanity/icons'
import {Button, Card, Inline, Menu, MenuButton, MenuItem, Text, TextInput} from '@sanity/ui'
import {defineQuery} from 'groq'
import {useEffect, useState} from 'react'
import {ObjectFieldProps, Path, set, unset, useClient} from 'sanity'

import {QueryResult} from '../sanity.types'
import {CustomImageInput} from './CustomImage'

export type Crop = {top: number; left: number; width: number; height: number}

export const ImagePreview = (props: ObjectFieldProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [customImage, setCustomImage] = useState<QueryResult | undefined>()
  const client = useClient({apiVersion: '2021-06-07'})
  const {value} = props as any

  useEffect(() => {
    if (!value || !value.image || !value.image._ref) {
      return
    }
    const getCustomImage = async () => {
      const query = defineQuery(`*[_type == 'customImage' && _id == $ref][0]`) // this is currently getting everything but projection can be added to limt what we want to retreive
      const storedImage = await client.fetch(query, {ref: value.image._ref})
      setCustomImage(storedImage)
    }
    getCustomImage()
  }, [value])

  useEffect(() => {
    if (!customImage || !customImage.imageUrl) {
      return
    }
    // prorbably worth seperating this out into its own exported function, then it could aslo be used by the client like sanity image builder

    const getImageUrl = () => {
      if (value?.crop) {
        const imageRegex = new RegExp(
          /^\/(?<type>.*?(?=\/))\/(?<prefix>.*?(?=\/))\/(?<identifier>.*?(?=\/))\/(?<region>.*?(?=\/))\/(?<size>.*?(?=\/))\/(?<rotation>.*?(?=\/))\/(?<quality>.*?(?=\.))\.(?<format>.*?(?=\?|$))/,
        )
        const existingImageURL = new URL(customImage.imageUrl)
        const {type, prefix, identifier, size, rotation, quality, format} = imageRegex.exec(
          existingImageURL.pathname,
        )?.groups as any // github issue for this: https://github.com/microsoft/TypeScript/issues/32098
        const cropPath = `pct:${value.crop.left},${value.crop.top},${value.crop.width},${value.crop.height}`
        const cropImagePath = `/${type}/${prefix}/${identifier}/${cropPath}/${size}/${rotation}/${quality}.${format}`
        return setImageUrl(`${existingImageURL.origin}${cropImagePath}`)
      }
      setImageUrl(customImage.imageUrl)
    }
    getImageUrl()
  }, [customImage, value])

  if (!value || !value.image || !value.image._ref) {
    return <CustomImageInput {...props.inputProps} />
  }

  const clearImage = () => {
    props.inputProps.onChange(unset())
  }

  const setCrop = (newCrop?: Crop) => {
    if (!newCrop) {
      return props.inputProps.onChange(unset(['crop']))
    }

    if (!value.crop) {
      return props.inputProps.onChange(set(newCrop, ['crop']))
    }
    const locations = Object.keys(newCrop) as (keyof Crop)[]
    const patches = locations.map((location) => {
      return set(newCrop[location], ['crop', location])
    })
    props.inputProps.onChange(patches)
  }

  const setMeta = ({overwrite, path}: {overwrite?: string; path: Path}) => {
    if (!overwrite) {
      return props.inputProps.onChange(unset(path))
    }

    if (!value.metaOverwrite) {
      console.log(path)
      const lastPath = path.slice(-1)[0]
      console.log(lastPath)
      return props.inputProps.onChange(set({metaOverwrite: {[lastPath as string]: overwrite}}))
    }
    props.inputProps.onChange(set(overwrite, path))
  }

  return (
    <Card>
      <div style={{position: 'relative'}}>
        <Card style={{textAlign: 'center'}}>
          <div style={{width: '100%', textAlign: 'center', overflow: 'hidden'}}>
            <img
              src={imageUrl}
              style={{
                maxWidth: '587px',
              }}
            />
            <Inline space={1}>
              <Button onClick={() => setCrop({top: 20, left: 20, width: 50, height: 50})}>
                Set Crop to x:20%, y:20%, w:50%, h:50%
              </Button>
              <Button onClick={() => setCrop()}>Reset crop</Button>
            </Inline>
          </div>
          {value.crop && (
            <Card>
              Current Crop is {value.crop.left ? `x:${value.crop.left}% ` : ''}
              {value.crop.top ? `:${value.crop.left}% ` : ''}
              {value.crop.width ? `w:${value.crop.width}% ` : ''}
              {value.crop.height ? `h:${value.crop.height}% ` : ''}
            </Card>
          )}
          <Card>
            {
              // This is an example of setting an overwrite meta data field. In the groq to get the data out we should use the coalesce
              // function to use this value if set else fallback to the one stored on the image record
            }
            <Text>Fallback value: {customImage?.title}</Text>
            <TextInput
              onChange={(event) =>
                setMeta({
                  overwrite: event.currentTarget.value,
                  path: ['metaOverwrite', 'title'],
                })
              }
              value={value?.metaOverwrite?.title}
            />
          </Card>
        </Card>
        <Inline
          style={{position: 'absolute', top: '0px', right: '0px'}}
          marginRight={1}
          marginTop={1}
        >
          <Card style={{textAlign: 'right'}}>
            <MenuButton
              id="custom-image-menu-button"
              button={<Button mode="ghost" icon={EllipsisHorizontalIcon} />}
              menu={
                <Menu>
                  <MenuItem
                    icon={ResetIcon}
                    tone="critical"
                    text="Clear field"
                    onClick={clearImage}
                  />
                </Menu>
              }
              popover={{placement: 'bottom'}}
            />
          </Card>
        </Inline>
      </div>
    </Card>
  )
}
