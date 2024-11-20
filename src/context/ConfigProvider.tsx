import {createContext, useContext} from 'react'
import {LayoutProps} from 'sanity'
import {OLDamConfig} from '..'

const OLDamContext = createContext({baseURL: ''})

type ConfigProviderProps = LayoutProps & {pluginConfig: OLDamConfig}

/**
 * Plugin config context hook from the Cross Dataset Duplicator plugin
 * @public
 */
export function useOLDamConfig() {
  const pluginConfig = useContext(OLDamContext)

  return pluginConfig
}

export function ConfigProvider(props: ConfigProviderProps) {
  const {pluginConfig, ...rest} = props

  return (
    <OLDamContext.Provider value={pluginConfig}>{props.renderDefault(rest)}</OLDamContext.Provider>
  )
}
