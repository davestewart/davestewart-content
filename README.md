# Dave Stewart

> The content for Dave Stewart's personal website at https://davestewart.co.uk

## Frontmatter

All markdown files support frontmatter.

Here's a typical post example:

```markdown
---
description: A brief description of the post
date: 2020-08-01
github: davestewart/some-repo
visibility: preview
tags:
  - library
  - tools
  - node
  - design
media:
  thumbnail: ./images/some-repo-thumbnail.png
  featured: ./images/some-repo-featured.png
  gallery:
    - ./images/some-repo-01.png
    - ./images/some-repo-02.png
    - ./images/some-repo-03.png
  other:
    - text: Some image caption
      src: ./images/other-image-01.png
    - text: Other image caption
      src: ./images/other-image-02.png
---

# Post title

Post content...
```

Note that post `title` will be parsed from the first heading in the post.

### Post

####  General properties

These values provide data about the page itself:

| Key           | Description                                                               |
|---------------|---------------------------------------------------------------------------|
| `shortTitle`  | An optional short post title to show in breadcrumbs                       |
| `description` | The post description                                                      |
| `date`        | The publish date in the form `yyyy-mm-dd` (set in the future to schedule) |
| `visibility`  | Where and how to show the post (see table below)                          |
| `tags`        | A list of tags to show and appear in Search                               |
| `github`      | Github repo in the form `user/repo`                                       |
| `media`       | A hash of `key:value` options to display post images (see table below)    |
| `<any>`       | Any other data to be referenced in the page                               |

#### Post `visibility` values

How and where a post should show:

| Value              | URL | List | Description                                                     |
|--------------------|:---:|:----:|-----------------------------------------------------------------|
| `public` (default) | `x` | `x`  | Shows to all people                                             |
| `preview`          | `x` |      | Not listed but accessible by link, and shows a note on the page |
| `unlisted`         | `x` |      | Not listed but accessible by link                               |

#### Post `media` keys

Post media can be described using the following keys:

| Key               | Description                                  |
|-------------------|----------------------------------------------|
| `media`           | Top level key for media                      |
| `media.thumbnail` | Relative path to thumbnail image             |
| `media.featured`  | Relative path to featured post image         |
| `media.opengraph` | Relative path to social preview image        |
| `media.gallery`   | List of relative paths (replaces `featured`) |
| `media.<any>`     | Any other data to be referenced in the page  |

#### Post `media.*` keys

All media keys (other than `thumbnail` which must be a path or url) can be:

- a relative path or url
- an object of media properties

Supported media object properties are:

| Key              | Description                   |
|------------------|-------------------------------|
| `media.*`        | List of gallery nodes         |
| `media.*.src`    | Optional relative path or url |
| `media.*.width`  | Optional media width          |
| `media.*.height` | Optional media height         |
| `media.*.text`   | Optional caption text         |
| `media.*.href`   | Optional link to media        |

Note that `gallery` nodes (or custom nodes referenced by media elements) can be an array of either.

### Folder index files

Folders may contain their own `index` files, with the following keys:

| Key           | Description                                                                |
|---------------|----------------------------------------------------------------------------|
| `layout`      | The layout for the index thumbnails, choose from`folder`, `tree`           |
| `order`       | The order of this folder in the parent list                                |
| `toc`         | An optional table of content to show, and which levels, for example, `2,3` |


## Status

Final page `status` is determined by `visibility` and `date` frontmatter properties, and will determine whether a post is included in the site's posts array, shown in lists, or accessible by the URL.

| Status      | Prop         | Prop value     | URL | List |
|-------------|--------------|----------------|:---:|:----:|
| `new`       | `date`       | Within 90 days | `x` | `x`  |
| `published` | `date`       | In the past    | `x` | `x`  |
| `unlisted`  | `visibility` | `unlisted`     | `x` | `-`  |
| `draft`     | `date`       | No date        | `-` | `-`  |
| `draft`     | `draft`      | `true`         | `-` | `-`  |
| `preview`   | `visibility` | `preview`      | `-` | `-`  |
| `scheduled` | `date`       | In the future  | `-` | `-`  |

Key:

- `x`: visible in production
- `-`: visible in development


## Scripts

The repo comes with some handy scripts.

### `new-post`

Runs interactively to generate a new post, including stub images:

```text
📝 Post Generator

✔ What kind of post? blog
✔ Which category? productivity
✔ What's the title? How to be better at things
✔ What's the folder name? how to be better
✔ What's the description? 100 tips and tricks to be more 
effective in day to day life
✔ Select tags (use space to select, enter to confirm):
[Category] productivity

🎨 Generating placeholder images...

✅ Post created successfully at:
  - /content/blog/productivity/how to be better
📄 Edit your post:
  - /content/blog/productivity/how to be better/index.md
```

### `edit-post`

Runs interactively to choose an existing post and edit tags:

```text
✏️  Post Editor

✔ Search for a post: [projects] Alias HQ

📝 Editing: Alias HQ
📁 Path: open-source/alias-hq

✔ Select tags (use space to select, enter to confirm):
 [Format] library, [Domain] creative, [Language] node, 
[Category] tools

✅ Post updated successfully!
📄 /content/projects/open-source/alias-hq/index.md

```

### `check-tags`

Runs on commit and checks all tags are listed in `tags.json`.

If a post contains a tag not listed in `tags.json`, the commit will fail.

Either edit the file to add the missing tag, or remove unlisted the tag from the post. 
