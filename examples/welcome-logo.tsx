/** @jsxImportSource @opentui/solid */
import { readFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { For } from "solid-js"
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui"

const read = (path: string) => {
  try {
    return readFileSync(path, "utf8")
  } catch {
    return undefined
  }
}

const art =
  read(fileURLToPath(new URL("./screensaver.txt", import.meta.url))) ??
  read(join(homedir(), ".config", "omarchy", "branding", "screensaver.txt")) ??
  ""

const ART = art
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