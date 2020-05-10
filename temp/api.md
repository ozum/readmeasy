
<a name="readmemd"></a>

# readmeasy

## Functions

###  createReadMe

▸ **createReadMe**(`options`: object): *Promise‹void›*

*Defined in [src/index.ts:19](https://github.com/ozum/readmeasy/blob/c0962a8/src/index.ts#L19)*

Creates README.md from REDAME template.

**Parameters:**

▪`Default value`  **options**: *object*= {}

are the options.

Name | Type | Description |
------ | ------ | ------ |
`contextFiles?` | string &#124; string[] | js, ts, JSON5 or YAML files to get data to be passed to template under a key same as file name. |
`defaultContent?` | undefined &#124; string | Default content to create README template with. |
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

▸ **findOrCreateTemplateFile**(`__namedParameters`: object): *Promise‹string›*

*Defined in [src/utils.ts:64](https://github.com/ozum/readmeasy/blob/c0962a8/src/utils.ts#L64)*

Finds or creates README template file and returns the file found or created path.

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {} as any

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`defaultContent` | undefined &#124; string | - | is the default content to create README template with. |
`dir` | string | - | is the directory to search README template for. |
`templateExtension` | string | "njk" | - |

**Returns:** *Promise‹string›*

path of the README template.

___

###  findTemplateFile

▸ **findTemplateFile**(`dir`: string): *Promise‹string | undefined›*

*Defined in [src/utils.ts:51](https://github.com/ozum/readmeasy/blob/c0962a8/src/utils.ts#L51)*

Returns README template file by searching given directory for supported template extensions.
If more than one found, returns first one.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dir` | string | is the directory to search README template for. |

**Returns:** *Promise‹string | undefined›*

template file path.
