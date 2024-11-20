import {definePlugin} from 'sanity'

import customImageDocument from './schema/document'
import customImageObject from './schema/object'
import {ConfigProvider} from './context/ConfigProvider'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CortexAssetPicker: any
  }
}

export interface OLDamConfig {
  /* nothing here yet */
  baseURL: string
}

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {myPlugin} from 'sanity-plugin-OLdam'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [myPlugin()],
 * })
 * ```
 */
export const OLdam = definePlugin<OLDamConfig>((pluginConfig) => {
  return {
    name: 'sanity-plugin-oldam',
    schema: {
      types: [customImageObject, customImageDocument],
    },
    studio: {
      components: {
        layout: (props) => ConfigProvider({...props, pluginConfig}),
      },
    },
    document: {
      actions: (prev, context) => {
        return prev.map((previousAction) =>
          previousAction.action !== 'delete' && context.schemaType === 'customImage'
            ? undefined
            : previousAction,
        )
      },
    },
  }
})
