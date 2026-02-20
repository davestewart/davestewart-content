---
description: File-system based routing for WXT browser extensions
date: 2025-11-28
tags:
  - library
  - typescript
  - chrome-extension
  - vue
  - architecture
github: davestewart/wxt-module-pages
media:
  thumbnail: ./images/wxt-pages-thumb.png
  featured: ./images/wxt-pages-featured.png
---

# WXT Pages

## Overview

WXT Pages brings file-based routing to [WXT](https://wxt.dev):

```tree
/pages
  /+layout.vue      → Wrapper component for all pages
  /index.vue        → /
  /(marketing)
    /about.vue      → /about 
    /contact.vue    → /contact
  /users
    /[id].vue       → /items/:id
    /[id]
      /edit.vue     → /items/:id/edit
```

It takes the best functionality from [Next.js](https://nextjs.org/docs/pages/building-your-application/routing), [Nuxt](https://nuxt.com/docs/4.x/getting-started/routing) and [SvelteKit](https://svelte.dev/docs/kit/routing) routers, to make pages and routing as idiomatic and automated as entry point generation.

Fall back on concepts such as layouts, nested routes, route groups, dynamic routes, and more.

## Usage

Define routes simply by creating files in a `pages` directory, and the module automatically generates the configuration:

| Type                | File                               | Description                                           |
|---------------------|------------------------------------|-------------------------------------------------------|
| Standard Pages      | `pages/index.vue`                  | Regular files become routes                           |
| Nested Routes       | `pages/<users>/profile.vue`        | Folders create path segments                          |
| Dynamic Parameters  | `pages/posts/[slug].vue`           | Square brackets create dynamic route segments         |
| Catch-all Routes    | `pages/docs/[...slug].vue`         | Triple dots create catch-all routes to any depth      |
| Flat Route Format   | `pages/users_[id]_edit.vue`        | Underscores also generte nested folders               |
| Route Groups        | `pages/(marketing)/about.vue`      | Parentheses nest folders but not the URL              |
| Layouts             | `pages/dashboard/+layout.vue`      | Layout files wrap all routes in the same directory    |
| Index Routes        | `pages/dashboard/+index.vue`       | Index route files create nested route structures      |
| Ignored Files       | `pages/_components/Button.vue`     | Folders or files starting with `_` or `.` are ignored |
| Scoped Pages        | `<layer>/pages/@global/shared.vue` | Generate routes in the specified scope                |

WXT Pages is effectively a powerful page based router, with drivers for Vue, React, Preact, Svelte, Solid, and Angular make manual route configuration needless.

## Benefits

Whilst small projects won't benefit from file-based routing, pages simplifies large extension development:

- **Zero configuration** routing that just works
- **Type-safe routes** with TypeScript support
- **Hot module replacement** during development
- **Familiar patterns** from modern web frameworks
- **Clean architecture** with conventional file structure

## Links

- [GitHub](https://github.com/davestewart/wxt-module-pages)
