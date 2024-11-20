import {Dispatch, SetStateAction} from 'react'
import {MultipleMutationResult, SanityClient} from 'sanity'

const GAB_VERSION = 'v1.1.0'

const createLoadPromise = (url: string, type: 'script' | 'style' = 'script'): Promise<void> => {
  return new Promise(function (resolve, reject) {
    let element: HTMLScriptElement | HTMLLinkElement | null = null
    switch (type) {
      case 'style':
        element = document.createElement('link')
        element.rel = 'stylesheet'
        element.type = 'text/css'
        element.href = url
        break
      case 'script':
      default:
        element = document.createElement('script')
        element.src = url
        break
    }
    element.onload = () => resolve()
    element.onerror = reject
    document.head.appendChild(element)
  })
}

export const loadGAB = async (): Promise<void> => {
  if (window.CortexAssetPicker) {
    // eslint-disable-next-line no-console
    console.info('GAB already loaded!')
  } else {
    // Load GAB from CDN
    const promises = [
      createLoadPromise(
        `https://downloads.orangelogic.com/Cortex/4SQPK-AssetBrowser/${GAB_VERSION}/OrangeDamAssetBrowser.min.js`,
      ),
      createLoadPromise(
        `https://downloads.orangelogic.com/Cortex/4SQPK-AssetBrowser/${GAB_VERSION}/OrangeDamAssetBrowser.min.css`,
        'style',
      ),
    ]

    await Promise.all(promises)
  }
}

export const openGAB = async (
  baseUrl: string,
  client: SanityClient,
  multipleImages: boolean,
  setResults: Dispatch<SetStateAction<MultipleMutationResult | undefined>>,
): Promise<void> => {
  // console.log('creatiing transcations')
  // const transactions = client.transaction()
  // //transform asset to doc
  // console.log('transforming doc')
  // const doc = {
  //   _id: 'customiamge-3',
  //   _type: 'customImage',
  //   title: 'some image title',
  //   imageUrl: 'https://placehold.co/800x400',
  // }
  // console.log('Create if not there')
  // transactions.createIfNotExists(doc)

  // console.log('Commit ')
  // const results = await transactions.commit()
  // console.log('results', results)
  // setResults(results)
  // console.log('set results')
  window.CortexAssetPicker.open({
    baseUrl: baseUrl,
    multiSelect: false,
    extraFields: ['CoreField.Identifier', 'CoreField.alternative-description'],
    async onImageSelected(assets: any[]) {
      const transactions = client.transaction()
      assets.map((asset) => {
        //transform asset to doc
        console.log(asset)
        const doc = {
          _id: asset.extraFields['CoreField.Identifier'],
          _type: 'customImage',
          title: asset.extraFields['CoreField.alternative-description'],
          imageUrl: asset.imageUrl,
        }
        return transactions.createIfNotExists(doc)
      })

      const results = await transactions.commit()
      setResults(results)
    },
    onError(error: any) {
      // eslint-disable-next-line no-console
      console.log(error)
    },
  })
}
