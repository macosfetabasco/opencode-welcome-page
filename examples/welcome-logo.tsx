/** @jsxImportSource @opentui/solid */
import { readFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { For } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const ART = readFileSync(join(homedir(), ".config", "omarchy", "branding", "screensaver.txt"), "utf8")
  .replaceAll("\r", "")
  .trimEnd()
  .split("\n")
  .map((line) => line.trimEnd())

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

const plugin: TuiPluginModule & { id: string } = {
  id: "welcome-logo",
  tui,
}

export default plugin