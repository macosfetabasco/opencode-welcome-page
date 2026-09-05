# opencode-welcome-page

Customize the opencode TUI welcome (home) screen by overriding its slots with a
TUI plugin — including a ready-made plugin that shows the Omarchy screensaver
mustache as your startup logo.

- `skill/SKILL.md` — the opencode skill (install from `~/.agents/skills/` or
  `~/.config/opencode/skills/`).
- `examples/welcome-logo.tsx` — the working TUI plugin used in the skill.
- `examples/screensaver.txt` — the bundled Omarchy screensaver mustache art.

## What it does

opencode's home screen is built from extensible slots:

| Slot | Render mode | Purpose |
| ---- | ----------- | ------- |
| `home_logo` | replace | The startup logo / wordmark |
| `home_prompt` | replace | The input prompt |
| `home_prompt_right` | accumulate | Right side of the prompt row |
| `home_bottom` | accumulate | Content under the prompt (tips live here) |
| `home_footer` | single_winner | The footer bar |

The example plugin registers the `home_logo` slot and paints the mustache art.
It grabs a `screensaver.txt` sitting next to the plugin file first, and falls
back to the Omarchy branding file (`~/.config/omarchy/branding/screensaver.txt`)
— the same file `ttfx` renders in the screensaver — so the two stay in sync on
Omarchy.

## Install

1. Copy `examples/welcome-logo.tsx` and `examples/screensaver.txt` to
   `~/.config/opencode/`.
2. Register it in `~/.config/opencode/tui.json`:

   ```json
   {
     "$schema": "https://opencode.ai/tui.json",
     "plugin": ["./welcome-logo.tsx"]
   }
   ```

3. Ensure `@opencode-ai/plugin` and the `@opentui` peer packages are installed
   in `~/.config/opencode/` (see the skill for a full `package.json`).
4. Quit and restart opencode.

## Requirements

- opencode TUI v1.18.29+ (slot API)
- Omarchy (for the screensaver art path)
- `npm` for installing the plugin dependencies

## License

MIT