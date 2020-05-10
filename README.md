# readmeasy



Creates README.md for node modules using any template engine as easy as possible.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
- [Details](#details)
  - [](#)
- [CLI Options](#cli-options)
- [Details](#details-1)
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
- [API](#api)
- [readmeasy](#readmeasy)
  - [Functions](#functions)
    - [createReadMe](#createreadme)
    - [findOrCreateTemplateFile](#findorcreatetemplatefile)
    - [findTemplateFile](#findtemplatefile)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Usage

**CLI**

- First, create a README template (`README.njk`, `README.hbs`, etc.)
- Next, execute `readmeasy`

```bash
$ npx readmeasy
```

**API**

```ts
import createReadMe, { findOrCreateTemplateFile, findTemplateFile } from "readmeasy;

async function demo() {
  await createReadMe();
}

```

# Details

- creates `README.md` from template (`README.njk`, `README.hbs` etc.),
- if template does not exists, also creates `README.njk`,
- if template is created and there is a `README.md`, copies `README.md`'s content to template.

##

# CLI Options

```
--template-extension                    - File extension of the template.
--context-files <paths>                 - js, ts, JSON5 or YAML files to get data to be passed to template under a key same as file name.
--root-context-files                    - js, ts, JSON5 or YAML files to get data to be passed to template.
--partial-dirs <paths csv>              - Paths of directories which contains partial files.
--function-files <paths csv>            - Files to get filter/helper functions prefixed with file name. i.e "uc()" func in "path/helper.js" becomes "helperUc" helper/filter.
--root-function-files <paths csv>       - Files to get filter/helper functions prefixed with file name. i.e "uc()" func in "path/helper.js" becomes "uc" helper/filter.
--engine <engine name>                  - Template engine to be used. Supports engines supported by consolidate (https://www.npmjs.com/package/consolidate).
--debug                                 - Print stack trace in errors.
```

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

# API


<a name="readmemd"></a>

# readmeasy

## Functions

###  createReadMe

▸ **createReadMe**(`options`: object): *Promise‹void›*

*Defined in [src/index.ts:19](https://github.com/ozum/readmeasy/blob/43f08de/src/index.ts#L19)*

Creates README.md from REDAME template.

**Parameters:**

▪`Default value`  **options**: *object*= {}

are the options.

Name | Type | Description |
------ | ------ | ------ |
`contextFiles?` | string &#124; string[] | js, ts, JSON5 or YAML files to get data to be passed to template under a key same as file name. |
`dir?` | undefined &#124; string | Directory to serach README template. |
`engine?` | SupportedEngine | Template engine to be used. Supports engines supported by consolidate (https://www.npmjs.com/package/consolidate). Defaults to `partials`. |
`functionFiles?` | string &#124; string[] | Files to get filter/helper functions prefixed with file name. i.e "uc()" func in "path/helper.js" becomes "helperUc" helper/filter. |
`partialDirs?` | string &#124; string[] | Paths of directories which contains partial files. |
`rootContextFiles?` | string &#124; string[] | js, ts, JSON5 or YAML files to get data to be passed to template. |
`rootFunctionFiles?` | string &#124; string[] | Files to get filter/helper functions prefixed with file name. i.e "uc()" func in "path/helper.js" becomes "uc" helper/filter. |
`templateExtension?` | undefined &#124; string | File extension of the template. |

**Returns:** *Promise‹void›*

___

###  findOrCreateTemplateFile

▸ **findOrCreateTemplateFile**(`dir`: string, `extension`: string): *Promise‹string›*

*Defined in [src/utils.ts:62](https://github.com/ozum/readmeasy/blob/43f08de/src/utils.ts#L62)*

Finds or creates README template file and returns the file found or created path.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`dir` | string | - | is the directory to search README template for. |
`extension` | string | "njk" | is the extension to be used if template file would be created. |

**Returns:** *Promise‹string›*

path of the README template.

___

###  findTemplateFile

▸ **findTemplateFile**(`dir`: string): *Promise‹string | undefined›*

*Defined in [src/utils.ts:50](https://github.com/ozum/readmeasy/blob/43f08de/src/utils.ts#L50)*

Returns README template file by searching given directory for supported template extensions.
If more than one found, returns first one.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dir` | string | is the directory to search README template for. |

**Returns:** *Promise‹string | undefined›*

template file path.
