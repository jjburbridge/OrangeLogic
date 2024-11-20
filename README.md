# sanity-plugin-OLdam

> This is a **Sanity Studio v3** plugin.

## Installation

This plugin has not yet been published.

<!-- ```sh
npm install sanity-plugin-oldam
``` -->

## Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {OLDam} from 'sanity-plugin-oldam'

export default defineConfig({
  //...
  plugins: [OLDam({baseURL: 'some Orange logic dam url'})],
})
```

## License

[MIT](LICENSE) © Jon Burbridge

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
