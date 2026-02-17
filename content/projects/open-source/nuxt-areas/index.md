---
description: Scalable folder management for large Nuxt 2 projects
date: 2021-11-01
tags:
  - library
  - architecture
  - nuxt
  - vue
  - javascript
  - node
  - webpack
github: davestewart/nuxt-areas
media:
  thumbnail: ./images/nuxt-areas.png
  featured: ./images/nuxt-areas.png
  gallery:
    - ./gallery/nuxt-areas.png
    - ./gallery/nuxt-areas-demo.png
    - ./gallery/area-51.png
---
# Nuxt Areas

## Overview

[Nuxt](https://nuxtjs.org) is the main full stack framework for [Vue JS](https://vuejs.org/).

It ships out of the box with a folder structure siloed by responsibility:

```tree
+- src
    +- components
    |   +- product-list.vue             <- stripe 1
    |   +- user-list.vue
    +- pages
    |   +- products.vue                 <- stripe 2
    |   +- users.vue
    +- store
        +- products.js                  <- stripe 3
        +- users.js
        +- user.js
```

This results in files being "striped" across the application, and as applications grow, not only do related files get further apart, but they sit in a sea of *unrelated* files, adding a physical and cognitive overhead to working with the various subsystems of the site.

## Library

[Nuxt Areas](https://github.com/davestewart/nuxt-areas) is a Nuxt module that allows you to restructure your app to group related files by "area":

```tree
+- src
    +- areas
        +- products                     <- area 1
        |   +- components
        |   |   +- product-list.vue
        |   +- pages
        |   |   +- index.vue
        |   +- store.js
        +- users                        <- area 2
            +- classes
            |   +- User.js
            +- components
            |   +- user-list.vue
            +- pages
            |   +- index.vue
            +- store
                +- users.js
                +- user.js
```

Co-locating files this way has various advantages:

- it's easier to work on a discrete unit of functionality, such as "products" or "users"
- it's easier to understand what the site does as a whole
- it's easier to see how related files work together
- it's less hopping about between multiple branches of the folder tree
- it's easier to find a home for components, classes, or data
- naming is easier and imports are shorter

The library is available for Vue 2 and Vue 3 and handles:

- routing (dynamic and custom)
- store registration
- component registration
- Webpack aliases
- watching and debugging

## Nuxt 3

Nuxt 3 introduced its own ["layers"](https://nuxt.com/docs/3.x/getting-started/layers) functionality that allows you to achieve similar results, and more.

I wrote about that in detail in my article [Modular site architecture with Nuxt layers
](/blog/nuxt-layers/).

## Branding

If you're wondering what the logo is all about, it is the [Eye of Providence](https://en.wikipedia.org/wiki/Eye_of_Providence), or "all-seeing eye".

When I was experimenting with designs, I tested ideas with folders, network icons, the share icon, triangles, the letter "A", but nothing seemed to resonate.

Someone on Twitter mentioned "Area 51" which I thought was amusing but didn't take it seriously as a logo idea, but later the Eye of Providence popped into my head. Crazily, it seemed like it might work:

- Areas give you a top-down overview – _the eye_
- it gives you a hierarchy – _the triangle_
- it's a pretty radical approach – _the rays & stars_
 
Plus, it's a little bit wacky and goes with the slightly esoteric title!

![nuxt areas demo logo](./images/nuxt-areas-demo.png)

The [Area 51](https://github.com/davestewart/area-51) idea made it in as the demo repo for registering areas from external folders, NPM modules, etc.

![nuxt areas area 51 logo](./images/nuxt-areas-area-51.png)

The original logo was designed by myself using online resources (I'm fine with a bit of logo design, but I'm no illustrator), and I commissioned the alien eye to match the original design.

## Links

- [GitHub](https://github.com/davestewart/nuxt-areas)
- [Main Demo](https://github.com/davestewart/nuxt-areas-demo)
- [Area 51 Demo](https://github.com/davestewart/area-51) 👽

