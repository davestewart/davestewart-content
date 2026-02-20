---
description: Nuxt-like layers functionality for WXT browser extensions
date: 2025-11-28
tags:
  - library
  - typescript
  - chrome-extension
  - architecture
  - tools
github: davestewart/wxt-module-layers
media:
  thumbnail: ./images/wxt-layers-thumb.png
  featured: ./images/wxt-layers-featured.png
---

# WXT Layers

## Overview


[WXT Layers](https://github.com/davestewart/wxt-module-layers) lets you to organise your WXT extension into self-contained modules:

```tree
+- src                   <-- core extension logic
+- layers
    +- some-feature      <-- isolated feature
    +- some-service      <-- isolated service
```

Layers can contain any combination of entrypoints, composables, public files, assets, etc.:

```tree
+- src                   <-- core extension logic
|   +- composables
|   +- entrypoints
|   +- public
|   +- utils
|
+- layers
    +- some-feature      <-- isolated feature
    |   +- entrypoints
    |   +- public
    |
    +- some-service      <-- isolated service
       +- composables
       +- index.ts
```

This approach is ideal for large projects where you need cleaner code organization and feature isolation, making your extension more maintainable and modular.

## Links

- [GitHub](https://github.com/davestewart/wxt-module-layers)
- [Documentation](https://github.com/davestewart/wxt-module-layers#readme)
