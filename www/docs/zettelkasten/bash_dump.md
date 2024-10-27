🗓️20102024 0117
📎 #bash

# bash_dump

1. tmux ls >/dev/null 2>&1
tmux ls: This command lists all existing tmux sessions. If there are no tmux sessions, it returns an error, and if sessions exist, it outputs a list of them.

>/dev/null 2>&1:

>/dev/null: This part redirects the standard output (stdout) to /dev/null, which is a "black hole" in Unix systems. Any output sent to /dev/null is discarded.
2>&1: This redirects the standard error (stderr) (file descriptor 2) to the same place as standard output (stdout) (file descriptor 1). Since stdout is already being sent to /dev/null, this means both the normal output and any error messages will be discarded.
In summary: This line runs the tmux ls command but discards both its output and any error messages. The purpose of this is to only check whether the command succeeds (indicating there are tmux sessions) or fails (indicating there are no tmux sessions) without showing the output to the user.

2. -z Flag
-z: This is a conditional flag in shell scripting that checks if a string is "null" or "empty." The -z flag returns true if the string is of zero length (i.e., empty), and false otherwise.

---

# References
- ChatGPT
