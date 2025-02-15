🗓️ 15022025 2138
📎

# VIM

```ad-note
Checkout [this](/documents/intro_to_vim.pdf) for a quick intro to vim!
```

## Macros

1. Begin recording with q command
2. Choose register (a-z)
3. Edit however you want
4. End recording with q command

```vim
# On lines 5 -10
:5,10norm! @a

# Line 5 to end of file
:5,$norm! @a

# All lines
:g/pattern/norm! @a


# Visually selected lines
:'<,'>norm! @a
```

## Replacing text

```vi
# Replace the first occurrence of a pattern in a line
:s/pattern/replacement/

# Replace all occurrences of a pattern in a line
:s/pattern/replacement/g

# Replace from the current line to the end of the file
:.,$s/pattern/replacement/g

# Replace in the entire file
:%s/pattern/replacement/g

# Replace in a specific range of lines (e.g., line 5 to line 10)
:5,10s/pattern/replacement/g

# Replace with confirmation for each occurrence
:%s/pattern/replacement/gc

# Use \ to escape special characters (e.g., . or *)
:%s/escaped\.pattern/replacement/g

# Use & in the replacement to refer to the matched pattern
:%s/pattern/replace with & and more/g

# Make the search case-insensitive
:%s/pattern/replacement/gi

# Make the search case-sensitive (override the default setting)
:%s/pattern/replacement/gI

# Replace across multiple lines using \n for new lines
:%s/pattern\nanother line/replacement/g

# Replace "foo" with "bar" in the entire file
:%s/foo/bar/g

# Replace "hello" with "world" in lines 5 to 10, with confirmation
:5,10s/hello/world/gc

```

## Mapping types

| Type                    | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Recursive (map)         | If the result of this mapping exists as another mapping, Vim will execute that as well  |
| Non Recursive (noremap) | Vim will execute the result of this mapping as-is, without considering further mappings |
