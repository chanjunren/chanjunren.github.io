# VIM Cheatsheet

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

