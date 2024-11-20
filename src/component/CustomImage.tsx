import {Button} from '@sanity/ui'
import {useEffect, useState} from 'react'
import {MultipleMutationResult, ObjectInputProps, set, unset, useClient} from 'sanity'
import {loadGAB, openGAB} from '../lib/gab'
import {useOLDamConfig} from '../context/ConfigProvider'

export const CustomImageInput = (props: ObjectInputProps) => {
  console.log('input props', props)
  const [images, setImages] = useState<MultipleMutationResult | undefined>()
  const client = useClient({apiVersion: '2021-06-07'})
  const {baseURL} = useOLDamConfig()
  useEffect(() => {
    const loadPicker = async () => loadGAB()
    loadPicker()
  }, [])

  useEffect(() => {
    if (!images) {
      unset(['image'])
      return
    }
    const id = images?.documentIds[0]
    props.onChange(
      set(
        {
          _type: 'reference',
          _ref: id,
        },
        ['image'],
      ),
    )
  }, [images])
  return (
    <Button mode="ghost" onClick={() => openGAB(baseURL, client, false, setImages)}>
      Pick an image
    </Button>
  )
}
