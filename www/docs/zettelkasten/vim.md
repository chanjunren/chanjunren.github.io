🗓️ 15022025 2138

# VIM

```ad-note
JR's very own intro to vim over [here](/documents/intro_to_vim.pdf)! 🤓
```

## Command cheatsheet
> Commands in VIM generally follow this pattern

```
:[range][command][arguments]
```

| Part          | Description                                              | Example                             |
| ------------- | -------------------------------------------------------- | ----------------------------------- |
| `:`           | Starts an **ex** command                                 | `:w`, `:s/...`                      |
| `[range]`     | Optional line range                                      | `:%`, `5,10`, `.,$`                 |
| `[command]`   | The **action** to perform                                | `s`, `d`, `y`, `w`, `g`, `m`        |
| `[arguments]` | Optional **arguments**, like patterns, flags, file names | `/pattern/`, `/repl/gi`, `file.txt` |

## Yank & Registers Cheatsheet

| Command           | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| `"*y` or `"+y`    | Yank into **system clipboard** (`"*` = primary, `"+` = clipboard) |
| `"aY`             | Yank into **register `a`** (can be any letter `a`–`z`)            |
| `"0p`             | Paste from the **default yank register**                          |
| `"*p`             | Paste from **system clipboard**                                   |
| `:reg`            | Show **all registers and contents**                               |
| `yy` / `dd` / `p` | Yank, delete, and paste using **default register**                |
| `"ap`             | Paste from register `a`                                           |

## Macros

1. Begin recording with `q` command
2. Choose **register** (a-z)
3. Perform actions
4. End recording with `q` command

### using registers

| Command         | Description                |
| --------------- | -------------------------- |
| `:5,10norm! @a` | Do from lines 5-10         |
| `:5,$norm! @a`  | From line 5 to end of file |

## Replace Cheatsheet

| Command                    | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| `:s/pat/repl/`             | Replace **first** match in current line                      |
| `:s/pat/repl/g`            | Replace **all** matches in current line                      |
| `:.,$s/pat/repl/g`         | Replace from **current line to end**                         |
| `:%s/pat/repl/g`           | Replace in **entire file**                                   |
| `:5,10s/pat/repl/g`        | Replace from **line 5 to 10**                                |
| `:%s/pat/repl/gc`          | Replace in file, **confirm each** (`c = confirm`)            |
| `:%s/escaped\.pat/repl/g`  | Use `\` to **escape special chars** like `.` or `*`          |
| `:%s/pat/replace & more/g` | Use `&` to refer to the matched **original pattern**         |
| `:%s/pat/repl/gi`          | Case-**insensitive** replacement                             |
| `:%s/pat/repl/gI`          | Case-**sensitive**, even if `ignorecase` is on               |
| `:%s/pat\nnext/repl/g`     | Replace across **multiple lines** using `\n`                 |
| `:5,10s/hello/world/gc`    | Replace "hello" with "world" in lines 5–10, with **confirm** |
## Mapping types

| Type                    | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Recursive (map)         | If the result of this mapping exists as another mapping, Vim will execute that as well  |
| Non Recursive (noremap) | Vim will execute the result of this mapping as-is, without considering further mappings |
