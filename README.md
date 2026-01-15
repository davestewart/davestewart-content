# Dave Stewart

> The content for Dave Stewart's personal website at https://davestewart.co.uk

## Frontmatter

The following frontmatter key/values can be used.

### Post

####  General properties

These values provide data about the page itself:

| Key           | Description                                                               |
|---------------|---------------------------------------------------------------------------|
| `title`       | The post title                                                            |
| `shortTitle`  | A short post title to show on index pages                                 |
| `description` | The post description                                                      |
| `breadcrumb`  | Text to use for the navigation breadcrumb (at the top of the page)        |
| `date`        | The publish date in the form `yyyy-mm-dd` (set in the future to schedule) |
| `tags`        | A list of tags to show and appear in Search                               |
| `github`      | Github repo in the form `user/repo`                                       |
| `visibility`  | Where and how to show the post (see table below)                          |
| `<any>`       | Any other data to be referenced in the page                               |

#### Post `visibility` values

How and where a post should show:

| Value              | URL | List | Description                                                     |
|--------------------|:---:|:----:|-----------------------------------------------------------------|
| `public` (default) |  x  |  x   | Shows to all people                                             |
| `preview`          |  x  |      | Not listed but accessible by link, and shows a note on the page |
| `unlisted`         |  x  |      | Not listed but accessible by link                               |

#### Post `media` keys

Post media can be described using the following keys:

| Key               | Description                                      |
|-------------------|--------------------------------------------------|
| `media`           | Top level key for media                          |
| `media.thumbnail` | File path to thumbnail image                     |
| `media.opengraph` | File path to social preview image                |
| `media.featured`  | File path to featured post image                 |
| `media.gallery`   | List of gallery file paths (replaces `featured`) |
| `media.<any>`     | Any other data to be referenced in the page      |

#### Post `media.gallery` keys

Optionally, the `gallery` node can hold more information:

| Key                  | Description                |
|----------------------|----------------------------|
| `media.gallery`      | List of gallery file paths |
| `media.gallery.src`  | Optional image file path   |
| `media.gallery.text` | Optional caption text      |
| `media.gallery.href` | Optional link to image     |

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
| `new`       | `date`       | Within 90 days |  x  |  x   |
| `published` | `date`       | In the past    |  x  |  x   |
| `unlisted`  | `visibility` | `unlisted`     |  x  |  -   |
| `draft`     | `date`       | No date        |  -  |  -   |
| `draft`     | `draft`      | `true`         |  -  |  -   |
| `preview`   | `visibility` | `preview`      |  -  |  -   |
| `scheduled` | `date`       | In the future  |  -  |  -   |

Key:

- `x`: visible in production
- `-`: visible in development
