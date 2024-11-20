/**
 * NOTE: This is a dummy Sanity configuration in order
 * to generate TypeScript typings for the Shopify plugin.
 */
import {createClient} from '@sanity/client'
import {createMockAuthStore, DEFAULT_STUDIO_CLIENT_OPTIONS, defineConfig} from 'sanity'
import {OLdam} from './src'

const projectId = 'my-project'
const dataset = 'my-dataset'

export default {
  name: 'default',
  dataset,
  projectId,
  plugins: [
    OLdam({
      baseURL: '',
    }),
  ],
}
