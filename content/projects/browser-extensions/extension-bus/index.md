---
description: Universal message bus for web extensions
date: 2024-01-10
tags:
  - library
  - typescript
  - chrome-extension
  - api
  - architecture
github: davestewart/extension-bus
media:
  thumbnail: ./images/extension-bus-thumb.png
  featured: ./images/extension-bus-featured.png
---

# Extension Bus

## Overview

[Extension Bus](https://github.com/davestewart/extension-bus) provides cross-process messaging with an intuitive, API-like interface.

Create a bus in one process:

```ts
const bus = createBus({
  say: {
    hello (payload) {
      return `hello ${payload}!`
    }
  }
})
```

Call it from another process:

```ts
const bus = createBus({ ... })
const result = await bus.call('say/hello', 'world')
```

## Key Features

This package provides an elegant solution, with:

- simple cross-process messaging
- named buses to easily target processes
- nested handlers with an API-like interface
- transparent handling of sync and async handlers
- transparent handling of process and handler errors
- transparent handling of internal and external calls
- a consistent interface for process, tab and external calls

## Links

- [GitHub](https://github.com/davestewart/extension-bus)
- [Documentation](https://github.com/davestewart/extension-bus#readme)
- [Demo](https://github.com/davestewart/extension-bus/tree/main/demo)
