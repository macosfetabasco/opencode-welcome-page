---
name: opencode-welcome-page
description: Customize the opencode TUI welcome (home) screen. Use when the user asks to change the opencode welcome page, home screen, startup logo, wordmark, or heading; to show the Omarchy screensaver mustache on the opencode welcome screen; or to create, edit, or migrate the welcome-logo.tsx TUI plugin. Covers the home_logo slot, tui.json registration, theme tokens, and the restart requirement.
---

# opencode welcome page

The opencode TUI starts on a "home" screen (route `home`) showing a logo, a
prompt, a rotating tip, and a footer. Every element is a **slot** that a TUI
plugin can override. The default slot render modes are:

- `home_logo` — renders with `replace`: a registered plugin slot fully replaces
  the built-in opencode logo.
- `home_prompt` — renders with `replace`.
- `home_prompt_right`, `home_bottom`, `app_bottom` — accumulate (library mode).
- `home_footer` — `single_winner`.

## Where things live

| Item | Path |
| ---- | ---- |
| Global TUI config | `~/.config/opencode/tui.json` |
| TUI plugin file | e.g. `~/.config/opencode/welcome-logo.tsx` |
| Omarchy screensaver art | `~/.config/omarchy/branding/screensaver.txt` |

Plugins are declared in the `plugin` array of `tui.json`. Relative paths
resolve against the config file that declared them, so `"./welcome-logo.tsx"`
in the global `tui.json` resolves to `~/.config/opencode/welcome-logo.tsx`.

## How to add a custom logo

1. Create a TUI plugin module that registers the `home_logo` slot:

```tsx
/** @jsxImportSource @opentui/solid */
import { For } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const ART = ["  ▀▄  ", "▄▀  ▀▄", "▀▄  ▄▀", "  ▀▄  "]

const tui: TuiPlugin = async (api) => {
  api.slots.register({
    slots: {
      home_logo(ctx) {
        const theme = ctx.theme.current
        return (
          <box width="100%" flexDirection="row" justifyContent="center">
            <box flexDirection="column" alignItems="center">
              <For each={ART}>
                {(line) => (
                  <text fg={theme.text} selectable={false}>
                    {line}
                  </text>
                )}
              </For>
            </box>
          </box>
        )
      },
    },
  })
}

const plugin: TuiPluginModule & { id: string } = { id: "welcome-logo", tui }
export default plugin
```

2. Register it in `~/.config/opencode/tui.json`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "system",
  "plugin": ["./welcome-logo.tsx"]
}
```

3. Make `@opencode-ai/plugin` and the `@opentui` peer packages resolvable from
   the config directory. Example `package.json` at `~/.config/opencode/`:

```json
{
  "dependencies": {
    "@opencode-ai/plugin": "1.18.29",
    "@opentui/core": "0.4.5",
    "@opentui/keymap": "0.4.5",
    "@opentui/solid": "0.4.5",
    "@types/node": ">=22"
  }
}
```

   Install with `npm install` run from `~/.config/opencode/`. The `.tsx` file
   uses the `@jsxImportSource @opentui/solid` pragma, so the JSX transform needs
   `@opentui/solid` at runtime.

## Showing the Omarchy screensaver mustache

The Omarchy screensaver renders `~/.config/omarchy/branding/screensaver.txt`
through `ttfx`. To show that same art on the opencode welcome screen, have the
slot read the file at load time so the two stay in sync:

```tsx
import { readFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

const ART = readFileSync(join(homedir(), ".config", "omarchy", "branding", "screensaver.txt"), "utf8")
  .replaceAll("\r", "")
  .trimEnd()
  .split("\n")
  .map((line) => line.trimEnd())
```

Then render `ART` as in the example above. The art is roughly 80 columns wide
and fits standard terminals. Any change to `screensaver.txt` shows up on the
next opencode restart.

## Theme tokens

`ctx.theme.current` exposes theme-dependent colors as hex strings: `primary`,
`accent`, `secondary`, `text`, `textMuted`, `info`, `success`, `warning`,
`error`, `background`, `backgroundPanel`, `backgroundElement`, `border`, and
more. Use them directly on `fg`/`style` props (e.g. `theme.primary`) instead of
hard-coding colors.

## Tips

To change or hide the rotating tip under the prompt, target the `home_bottom`
slot (the internal tip plugin renders there). Hiding it: disable the internal
plugin via `plugin_enabled` in `tui.json`:

```json
"plugin_enabled": { "internal:home-tips": false }
```

## Notes

- Config and plugins are loaded once at startup and are **not hot-reloaded**.
  After any change, the user must quit and restart opencode.
- Run `opencode` in a pty to smoke-test (e.g. `script -qec "opencode" /dev/null`)
  and check `~/.local/share/opencode/log/opencode.log` for plugin `WARN`/`ERROR`
  lines. A missing `@opentui/solid` fails at JSX transform time.
- `home_logo` uses `replace`, so the last registered slot for it wins; a custom
  slot fully replaces the built-in opencode wordmark.