# readmeasy



Creates README.md for node modules using any template engine as easy as possible.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
- [Details](#details)
  - [Partials](#partials)
    - [module-headers](#module-headers)
  - [Context](#context)
    - [package](#package)
    - [allShields](#allshields)
  - [Helpers & Filters](#helpers--filters)
    - [firstAvailable(...input[]: any)](#firstavailableinput-any)
    - [prefixLines(string: string, replacer: string = ""): string](#prefixlinesstring-string-replacer-string---string)
    - [changeCase(string: string, to: type): string](#changecasestring-string-to-type-string)
- [Related Projects](#related-projects)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Usage

```bash
$ npx readmeasy
```

Above command:
- creates `README.md` from template (`README.njk`, `README.hbs` etc.),
- if template does not exists, also creates `README.njk`,
- if template is created and there is a `README.md`, copies `README.md`'s content to template.

# Details

`readmeasy` finds `README.njk` or `README.hbs` in your node module root and creates `README.md` from it. Additionally provides some utilities for the template such as partials, handlebars helpers and nunjucks filters, and useful context data acquired from `package.json`.

**Note:** Although any template engine supported by [consolidate](https://www.npmjs.com/package/consolidate) is supported, some of the provided utilities may (mostly) not available template engines other than `nunjucks` and `handlebars`.

For an example see this README's [README.njk template](https://github.com/ozum/readmeasy/blob/master/README.njk).

---

## Partials

Partials are sub template files which can be included in other templates.

**Example:**

| Engine     | Syntax                                             |
| ---------- | -------------------------------------------------- |
| Handlebars | `{{> module-header }}`              |
| Nunjucks   | `{% include "module-header.njk" %}` |

### module-headers

`module-headers` includes module name, description, table of contents and all badges/shileds defined in `package.json`.

---

## Context

Context is data provided to template files.

**Example:**

```handlebars
{{ package.name }}
```

### package

Includes data read from module's `package.json`.

**Example:**

```handlebars
Hello from {{ package.name }} module!
```

### allShields

Prints all shields (badges) read from `package.json`. Uses [badges](https://www.npmjs.com/package/badges) library under the hood. `readmeasy` provides a few additional shields described below:

| Shield                                                          | Example                                                                                                                          | Description                                                                                                                                              |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All shileds from [badges](https://www.npmjs.com/package/badges) |                                                                                                                                  | See its details [here](https://www.npmjs.com/package/badges)                                                                                            |
| conventionalcommits                                             | [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) | [Conventional Commits](https://www.conventionalcommits.org) shield.                                                                                      |
| commitizen                                                      | [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)  | Adds Commitizen-friendly badge described [here](https://github.com/commitizen/cz-cli#congratulations-your-repo-is-commitizen-friendly-time-to-flaunt-it) |

**Example:**

**package.json**

```json
{
  "shields": ["commitizen", "conventionalcommits"]
}
```

---

## Helpers & Filters

`readmeasy` provides some [helper](http://handlebarsjs.com/#helpers) functions for `handlebars` and [custom filters](https://mozilla.github.io/nunjucks/api.html#custom-filters) for `nunjucks`.

### firstAvailable(...input[]: any)

Returns first defined or non-empty input. This may be useful for `handlebars`, because it does not provide short circuit operator like `nunjucks`.

**Example:**

```handlebars
{{ firstAvaialbale package.label package.name }}
```

is equal to below in `nunjucks`

```nunjucks
{{ package.label or package.name }}
```

### prefixLines(string: string, replacer: string = ""): string

Prefixes a string to the beginning of each line in the first string

### changeCase(string: string, to: type): string

Implements the library [change-case](https://github.com/blakeembrey/change-case).

Available types are `camel`, `constant`, `dot`, `header`, `hyphen`, `isLower`, `isUpper`, `kebab`, `lower`, `lcFirst`, `no`, `param`, `pascal`, `path`, `sentence`, `snake`, `swap`, `title`, `upper`, `ucFirst`.

See its documentation for details.

```nunjucks
{{ "pencil" | changeCase("title") }} outputs Pencil
```

# Related Projects

[measy](https://www.npmjs.com/package/measy) - Create files using any template engine as simple as possible. Just a template and a JSON/YAML file is enough.
