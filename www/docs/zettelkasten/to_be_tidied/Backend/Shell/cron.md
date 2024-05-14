---
sidebar_position: 2
sidebar_label: CRON
---

# CRON

:::info
CRON expressions are used for scheduling tasks in Unix-based systems

Each CRON expression consists of five fields, representing different units of time.
:::

## Format
```
| | | | |
| | | | +----- Day of the Week (0 - 6) [Sunday = 0]
| | | +------- Month (1 - 12)
| | +--------- Day of the Month (1 - 31)
| +----------- Hour (0 - 23)
+------------- Minute (0 - 59)
```

## Fields
- **Minute**: Ranges from 0 to 59
- **Hour**: Ranges from 0 to 23
- **Day of the Month**: Ranges from 1 to 31
- **Month**: Ranges from 1 to 12 or can be specified by names (JAN, FEB, etc.)
- **Day of the Week**: Ranges from 0 to 6 (0 = Sunday) or can be specified by names (SUN, MON, etc.)

## Examples
| Example        | Description                                     |
|----------------|-------------------------------------------------|
| `0 12 * * *`   | 12 PM everyday                                  |
| `30 6 * * 1`   | 630am every Monday                              |
| `0 22 * * 1-5` | 10pm from Monday to Friday                      |
| `0 0 1 1 *`    | Midnight on the first day of January every year |

## Special Characters

| Character | Description                                                 |
|-----------|-------------------------------------------------------------|
| `*`       | Any value (every hour, everyday)                            |
| `-`       | Range of values (1-5 in `day` => Monday to Friday)          |
| `,`       | List of values (1,15 in `day` => 1st and 15th of the month) |
| `/`       | Increments (*/15 in `minute` => every 15 minutes)           |
