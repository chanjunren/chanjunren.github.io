🗓️ 06062026 2100

# define_errors_out_of_existence

Instead of handling every possible error, **redesign the interface so the error cannot happen**. Ousterhout argues that most exceptions add more complexity than the failures they protect against — the best error handling is the error handling you eliminate.

## The problem with defensive programming

- Each exception path is code that must be written, tested, and maintained
- Exception handlers are among the **most bug-prone** code — rarely exercised, often wrong
- Cascading exceptions (handler throws another exception) compound the problem
- Defensive programming encourages throwing exceptions "just in case," pushing complexity onto every caller

## Redefine semantics to remove the error

Change the contract so the previously-exceptional case becomes normal behavior.

### Tcl `unset`

Early versions threw an error if the variable didn't exist. Ousterhout changed it: `unset` on a non-existent variable silently succeeds. The caller's intent — "this variable should not exist" — is satisfied either way. No error needed.

### Unix file deletion

Deleting an open file doesn't fail. The file is unlinked from the directory immediately; the data persists until the last file descriptor closes. Two concerns (naming and lifetime) handled independently — no error for the "file is still in use" case.

## When exceptions are still necessary

Reserve exceptions for cases where **no reasonable default behavior exists**:
- Hardware I/O failure (disk dead, network unreachable)
- Fundamental contract violations the caller must know about
- Resource exhaustion with no fallback

The test: can the operation succeed by redefining what "success" means? If yes, redefine it. If no, throw.

## References

- John Ousterhout, *A Philosophy of Software Design* (2018), Ch. 10
- [Talks at Google — A Philosophy of Software Design](https://www.youtube.com/watch?v=bmSAYlu0NcY)
