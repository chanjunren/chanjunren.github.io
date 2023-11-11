---
sidebar_position: 1
sidebar_label: find
---

# Find Cheatsheet

## -type flag

| flag | description    |
|------|----------------|
| d    | directory      |
| f    | files          |
| l    | symbolic links |

## By name
:::info
Include `-iname` flag for case insensitive search
:::
```
find ~/Desktop -name "*.txt"
```

## By size
```
# Find files under 50 MB
find -size -50M

# Find files exactly 20KB
find -size 20K

# Find files > 1GbB
find -size 1G
```

## Finding By Time
```
# Items modified < 20 minutes ago
find -mmin -20 

# Items acessed more than 60 minutes ago
find -amin +60
```

## Logical operators
```
find -name "*chick*" -or -name "*kitty*"

find -type -f -not -name "*.html"
```

## User-Defined Actions
```
# Delete every file that contains "_OLD_" in file name
find - name "*_OLD_*" -exec rm '{}' ';'
```

