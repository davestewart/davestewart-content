---
description: Simplify and consolidate Nuxt layers paths' configuration 
date: 2024-05-09
tags:
  - library
  - architecture
  - nuxt
  - typescript
github: davestewart/nuxt-layers-utils
media:
  thumbnail: ./images/nuxt-layers-utils-thumb.png
  featured: ./images/nuxt-layers-utils-featured.png
---
# Nuxt Layers Utils

## Overview

Nuxt Layers are great to modularise your applications, [but they can be fiddly](/blog/nuxt-layers/#path-configuration), verbose and repetitive to configure.

[Nuxt Layers Utils](https://github.com/davestewart/nuxt-layers-utils) is a utility package that provides a standardized interface for generating path-specific configurations, making it simple to work with multiple layers in complex project structures.

The package streamlines the configuration of Nuxt layers by providing utility methods that handle layer extends, path aliases, folder reconfiguration, and auto-imports through a clean, intuitive API.

## Usage

The core of the library is the `useLayers()` function which takes your layer paths and returns a configuration object:

```typescript
import { useLayers } from 'nuxt-layers-utils'

const layers = useLayers(__dirname, {
  core: 'core',
  blog: 'layers/blog',
  site: 'layers/site',
})
```

This can then be used to generate layer configurations for Nuxt:

```ts
export default defineNuxtConfig({
  extends: layers.extends(),
  alias: layers.alias('#'),
})
```

Done manually, you'd need something like this:

```ts
export default defineNuxtConfig({
  extends: [
    'core',
    'layers/blog',
    'layers/site'
  ],
  alias: {
    '#core': '/Volumes/Projects/some-project/core',
    '#blog': '/Volumes/Projects/some-project/layers/blog',
    '#site': '/Volumes/Projects/some-project/layers/site',
  },
})
```

## API

Nuxt Layers comes with a slew of config and utility functions to generate output for anything that requires paths:

::scroll-h
| Layer Utils API      | Generates Nuxt Config                                                               | Purpose                                                                                                                             |
|----------------------|-------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `extends()`          | [`extends`](https://nuxt.com/docs/api/nuxt-config#extends)                          | Generates the folder paths which Nuxt should treat as layers                                                                        |
| `alias()`            | [`alias`](https://nuxt.com/docs/api/nuxt-config#alias)                              | Generates path aliases for named layers and arbitrary folders                                                                       |
| `dir()`              | [`dir`](https://nuxt.com/docs/api/nuxt-config#dir)                                  | Reconfigures Nuxt's core default folders                                                                                            |
| `dirPath()`          | [`dir[folder]`](https://nuxt.com/docs/api/nuxt-config#dir)                          | Generate a single relative path from a named layer                                                                                  |
| `importsDirs()`      | [`imports.dirs`](https://nuxt.com/docs/api/nuxt-config#imports)                     | Determines which folders should be auto-imported by Nuxt                                                                            |
| `components()`       | [`components`](https://nuxt.com/docs/api/nuxt-config#components)                    | Override default [component naming](https://nuxt.com/docs/guide/directory-structure/components#custom-directories) and registration |
| `contentSources()`   | [`content.sources`](https://content.nuxt.com/get-started/configuration#sources)     | Generates Nuxt Content sources                                                                                                      |
| `viteResolveAlias()` | [`vite.resolve.alias`](https://vitejs.dev/config/shared-options.html#resolve-alias) | Determines which folders should be auto-imported by Nuxt                                                                            |
::

See the [documentation](https://github.com/davestewart/nuxt-layers-utils#api) for more details.

## Links

- [GitHub](https://github.com/davestewart/nuxt-layers-utils)
- [Nuxt Layers article](/blog/nuxt-layers/)
