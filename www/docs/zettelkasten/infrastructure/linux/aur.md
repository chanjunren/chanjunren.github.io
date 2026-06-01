🗓️ 01062026 1727

# aur

The **Arch User Repository (AUR)** is a community-maintained collection of packages not in the official Arch repos. Instead of pre-built binaries, it ships **PKGBUILDs** — build scripts that compile and package software locally on your machine.

This is why EndeavourOS can install almost any Linux software: if it's not in the official repos, it's likely in the AUR.

## AUR Helpers

You don't interact with the AUR directly. Use a helper that automates the clone → build → install flow. The most common is `yay` — see [[yay]] for setup and commands.

## Before Installing an AUR Package

```ad-warning
AUR packages are community-maintained — not vetted by Arch. Always check the PKGBUILD before installing, especially for lesser-known packages.
```

```bash
yay -G pkgname      # clone without installing, so you can read the PKGBUILD first
```

## References

- [AUR overview](https://aur.archlinux.org/)
- [Arch Wiki: AUR](https://wiki.archlinux.org/title/Arch_User_Repository)
