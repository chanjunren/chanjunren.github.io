---
sidebar_position: 10
sidebar_label: Index Management
---

# Index Management

## Basic stuff
### Creating Index
```json
{
    "settings": { ...settings },
    "mappings": {
        "type_one": { ...any mappings ...},
        "type_two": { ...any mappings ...},
        ...
    },
}
```

### Deleting Index
```json
DELETE /my_index
DELETE /index_one,index_two
DELETE /index_*

```

### Settings
:::note
Don't modify ES defaults unless you know what you are doing
:::
- `number_of_shards`
    - Number of primary shards an indexG should have
    - default 5
    - cannot be changed after indxe creation
- `number_of_replicas`
    - Number of replica shards each primary shard should have
    - default 1
    - Can be changed at any time

## Configuring Analyzers / Custom Analyzers
:::note
Skipped for now
:::

## Types and Mappings
### How Lucene sees Doucments
- Simple list of field-value pairs
- Field
    - At least one value
    - Can have multiple values
- All values treated as **opaque bytes** (converted to bytes)

### How types are implemented
- Store the type name of each document in `_type`
- Filter using this field
- _Mapping_ is handled by ES
    - Lucene has no concept of 'mapping'