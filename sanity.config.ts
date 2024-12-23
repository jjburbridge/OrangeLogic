/**
 * NOTE: This is a dummy Sanity configuration in order
 * to generate TypeScript typings for the Shopify plugin.
 */
import {OLdam} from './src'

import {createClient} from '@sanity/client'
import {createMockAuthStore, DEFAULT_STUDIO_CLIENT_OPTIONS, defineConfig} from 'sanity'

const projectId = 'my-project'
const dataset = 'my-dataset'
const client = createClient({
  ...DEFAULT_STUDIO_CLIENT_OPTIONS,
  projectId,
  dataset,
  useCdn: false,
})

export default defineConfig({
  name: 'default',
  dataset,
  projectId,
  auth: createMockAuthStore({client, currentUser: null}),
  plugins: [
    OLdam({
      baseURL: '',
    }),
  ],
})
