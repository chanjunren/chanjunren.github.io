🗓️ 30032026 2100

# bluetoothctl

**bluetoothctl** is the CLI tool for managing Bluetooth on Linux (part of BlueZ).

## Quick Reference

### Setup

```bash
bluetoothctl
agent NoInputNoOutput    # skip PIN prompts (for mice, keyboards, etc.)
default-agent
```

### Connect to a Device

```bash
power on
scan on                          # wait for device to appear
pair AA:BB:CC:DD:EE:FF
trust AA:BB:CC:DD:EE:FF          # auto-reconnect on future boots
connect AA:BB:CC:DD:EE:FF
scan off
```

### Useful Commands

| Command                        | Description                |
|--------------------------------|----------------------------|
| `devices`                      | List known/paired devices  |
| `info AA:BB:CC:DD:EE:FF`       | Show device details        |
| `disconnect AA:BB:CC:DD:EE:FF` | Disconnect device          |
| `remove AA:BB:CC:DD:EE:FF`     | Unpair and forget device   |
| `power off`                    | Turn off Bluetooth adapter |

### Agent Capabilities

Set before pairing to match the device type:

| Capability        | Use case                         |
|-------------------|----------------------------------|
| `NoInputNoOutput` | Mice, headphones — no PIN needed |
| `KeyboardOnly`    | Devices that require PIN entry   |
| `DisplayYesNo`    | Devices with confirmation prompt |

---

## References

- BlueZ documentation
