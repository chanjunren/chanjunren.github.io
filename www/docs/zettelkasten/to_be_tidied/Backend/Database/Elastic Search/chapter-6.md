---
sidebar_position: 6
sidebar_label: Mapping and Analysis
---

# Mapping and Analysis

## Exact Values Versus Full Text
- Value of a field in structured data
- Straightforward: A value either matches or it doesn't
## Full text
- Values used to build an inverted index
- Textual data of natural language
- How _relevant_ is the document to the query

:::warning
Full text is not the same unstructured data
:::
```
May is fun but June bores me

Does it refer to months or to people?
```

## Inverted index
:::note
I'm just summarising here, you should read the book for the problems that these steps are trying to solve in the elasticsearch book
:::
- Data structure used for fast querying
- Steps for creation
    - Perform tokenization and normalization (_analysis_)
        - Tokenization: Splitting into individual terms
        - Normalization: Converting tokens into a standard form to improve searchability
    - Created sorted list of unique tokens
    - List in which document each term appears
![Inverted index diagram](chapter6_inverted_idx.png)

## Analysis and analyzers
### Examples
- Built-in
- Standard
- Simple
- Whitespace
- Language

### When they are used
- Querying full-text field (analyzer applied to query) 
- (Not applied for excat-value field queries)

### Specifying analyzers
- Done by specifying mapping for fields

## Mapping
### Core simple field types
| Type | Description |
| ---- | ----------- |
| JSON | type (?) |
| `boolean` | true / false |
| `long` | Whole number |
| `double` | Whole number |
| `date` | valid date string |
| `string` | string |

:::note
Fields of type string are by default considered to contain full text => will be analyzed before indexing
:::

### String matching attributes
#### `index`
- Controls how the string is indexed
| Value | Description |
| ----- | ----------- |
| `analyzed` | Analyze string then index it |
| `not_analzyed` | Index field exactly as value is specified |
| `no` | Don't index at all => field not searchable |

#### `analyzer`
- For specifying which analyzer to use at search / index time
- Built in: `standard`, `whitespace`, `english`, ...

### Updating a mapping
:::warning
Although you can add to an existing mapping, you can’t change it.
If a field already exists in the mapping, the data from that field
probably has already been indexed. If you were to change the field
mapping, the already indexed data would be wrong and would not
be properly searchable.
:::

#### Creating a mapping
`PUT /gb`

```json
{
  "mappings": {
    "tweet": {
      "properties": {
        "tweet": {
          "type": "string",
          "analyzer": "english"
        },
        "date": {
          "type": "date"
        },
        "name": {
          "type": "string"
        },
        "user_id": {
          "type": "long"
        }
      }
    }
  }
}
```

#### Modifying a mapping
`PUT /gb/_mapping/tweet`
```
{
 "properties" : {
 "tag" : {
 "type" : "string",
 "index": "not_analyzed"
 }
 }
}
```
#### Testing the Mappig
`GET /gb/_analyze?field=tweet`
Body: Black-cats
Output: `black`, `cat`

`GET /gb/_analyze?field=tag`
Body: Black-cats
Output: 'Black-cats'

### Complex Core Field Types
- ES also supports `null`, `arrays`, and `objects`

#### Multivalue Fields
- No special mapping required for arrays
- All values must be of same datatype
- Array retrieved will be same order as when the document was indexed

#### Empty fields
- Not indexed
- Lucene does not support storing `null` values
- All stored as empty values
    - `null`, `[]`, `[ null ]`

#### Multilevel Objects
- ES detect new object fields dynamically and map them as type `object`
- Each inner field listed under `properties`

_`user`, `tweet` and `name` are all objects_

```json
{
  "gb": {
    "tweet": {
      "properties": {
        "tweet": { "type": "string" },
        "user": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "gender": { "type": "string" },
            "age": { "type": "long" },
            "name": {
              "type": "object",
              "properties": {
                "full": { "type": "string" },
                "first": { "type": "string" },
                "last": { "type": "string" }
              }
            }
          }
        }
      }
    }
  }
}
```

#### How objects are indexed
- Lucene doesn't understand inner objects
- Lucene document consists flat list of key-value pairs

_Flattened document_ 
```json
{
  "tweet": ["elasticsearch", "flexible", "very"],
  "user.id": ["@johnsmith"],
  "user.gender": ["male"],
  "user.age": [26],
  "user.name.full": ["john", "smith"],
  "user.name.first": ["john"],
  "user.name.last": ["smith"]
}
```

##### Arrays of inner objects
_Indexed document_

```json
{
  "followers": [
    { "age": 35, "name": "Mary White" },
    { "age": 26, "name": "Alex Jones" },
    { "age": 19, "name": "Lisa Smith" }
  ]
}
```

_Flattened document_
```json
{
  "followers.age": [19, 26, 35],
  "followers.name": ["alex", "jones", "lisa", "smith", "mary", "white"]
}

```