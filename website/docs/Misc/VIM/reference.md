---
sidebar_position: 1
sidebar_label: Reference
---

# VIM Reference
:::info
Stuff that I keep forgetting
:::

## Motions
- b: move back one word
- w/e: move forward one word
- c: clear
- f: find
- t: to
- dd: delete whole line
- H M L: high, middle low


## Macros
### Recording a macro
1. Begin recording with q command
2. Choose register (a-z)
3. Edit however you want
4. End recording with q command

### Executing a macro on multiple lines
- On lines 5 -10 
```
:5,10norm! @a
```
- Line 5 to end of file
```
:5,$norm! @a
```
- All lines
```
:g/pattern/norm! @a
```
- Visually selected lines
```
:'<,'>norm! @a
```

# To Learn
- Ctrl B, 
- Session
- Panes
- Macros

## Types of Mappings
### map: Recursive mapping. 
> It means if the result of this mapping exists as another mapping, Vim will execute that as well.

### noremap: Non-recursive mapping.
> Vim will execute the result of this mapping as-is, without considering further mappings.
These mappings can be made specific to a mode:

| Mode        | Recursive  | Non-Recursive  |
|------------ | ---------- | -------------- |
| Normal      | nmap       | nnoremap       |
| Insert      | imap       | inoremap       |
| Visual      | vmap       | vnoremap       |
| Command     | cmap       | cnoremap       |
| Operator    | omap       | onoremap       |
