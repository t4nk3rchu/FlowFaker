# FlowFaker

Generate realistic test data from Flow Launcher with [Faker](https://fakerjs.dev), without leaving your keyboard. Every Faker module and method is available, with inline parameter hints, all Faker locales, and one-keystroke copy.

## Requirements
- Flow Launcher 2.x on Windows
- Node.js. FlowFaker is a Flow Launcher `JavaScript_V2` plugin. The first time it loads, Flow Launcher offers to download Node.js or lets you pick an existing `node.exe`; you can change it later in Flow Launcher's settings.

## Installation
- **From Flow Launcher:** type `pm install FlowFaker` and press Enter.
- **Manually:** download `Flow.Launcher.Plugin.FakerJS.zip` from [Releases](https://github.com/t4nk3rchu/FlowFaker/releases), drag it into the Flow Launcher window, and restart Flow Launcher.

## Usage
The action keyword is `fake`.

| You type | You get |
|---|---|
| `fake ` | All Faker modules |
| `fake person ` | The module's methods, each with a live sample |
| `fake person fullName` | 5 generated values. Enter copies one |
| `fake person fullName ` (trailing space) | Parameter helpers for that method, no generated values |
| `fake person fullName s` | Only the helpers starting with `s` |
| `fake date birthdate mode:` | The accepted values (`age`, `year`), also shown as greyed-out text after the cursor |

Helpers are tagged by where the parameter comes from:
- `sex:  [method]`: a parameter of the Faker method, read from Faker's docs.
- `repeat:  [global]`: a FlowFaker option that works on every method.

Press Tab or Enter on a helper to add it to the query, then type its value.

### Global parameters
- `repeat:<n>`: put several values in each result (max 100).
- `newline:true`: separate repeated values with newlines instead of `, `.
- `lang:<code>` (or `locale:<code>`): any of Faker's 76 locales, e.g. `vi`, `de`, `ja`, `pt_BR`, `zh_CN`. Codes are case-insensitive, `-` works as well as `_`, and a region Faker doesn't have falls back to its language (`vi_VN` → `vi`).

### Method parameters
Every method accepts the parameters listed in the [Faker API docs](https://fakerjs.dev/api/). FlowFaker reads them from the bundled Faker package at build time, so the helpers always match. Pass them as `key:value`:
- Numbers and `true`/`false` are converted automatically.
- Quote a value to keep spaces or to keep it a string: `characters:"a b c"`, `id:'123'`.
- `{…}` and `[…]` values are parsed as JSON: `header:{"alg":"HS256"}`.

### Name order
`person fullName` puts the family name first with `nameOrder:last-first` (short form `order:lf`). Vietnamese locales do this automatically, e.g. `Phùng Ngọc San`; `nameOrder:first-last` switches it back.

### Copy options
Press → on a generated value for more options:
- Copy the current value, or copy it as JSON.
- With `repeat:`, copy the values space-, newline- or comma-separated.
- Generate and copy 5 or 10 new values, comma- or newline-separated.

### Examples
```
fake person fullName sex:female lang:vi
fake person fullName nameOrder:last-first
fake internet email firstName:Jeanne lastName:Doe
fake date between from:2002-01-01 to:2002-02-01
fake date birthdate mode:age min:18 max:65
fake number int min:1 max:100 repeat:5
fake lorem words min:3 max:6
fake string fromCharacters characters:"abc 123" length:12
fake finance iban countryCode:DE
fake phone number style:international
fake location city lang:ja
```

## Upgrading from 1.x
2.0 replaces the engine. Commands, `lang:`, `repeat:`, quoted/JSON values, `nameOrder` and the copy formats all still work. What's different:
- **New:** parameter helpers, value hints in the search box, and `[method]`/`[global]` tags.
- **New:** Enter on a module or method opens it, and options like `sex:` on `person firstName` or `length:` on `string nanoid` are no longer ignored.
- **Changed:** with `repeat:`, Enter copies the values comma-separated. Add `newline:true` for one per line, or use the → menu.
- **Smaller:** the release zip is a fraction of its old size, because Faker is bundled into one file.

## Development
Uses [Bun](https://bun.sh) for tests and bundling. The shipped plugin is plain Node.js.

```
bun install
bun test
bun run build
```

- `bun run build` bundles `src/index.ts` and Faker into a single `dist/index.js`, so users need no `npm install`. It also copies Faker's license to `dist/FAKER-LICENSE.txt`.
- `src/faker-docs.ts` is a Bun macro. At build time it reads the JSDoc Faker ships in its `.d.ts` files and inlines every method's parameters, hints and descriptions. After upgrading `@faker-js/faker`, rebuild. `tests/faker-docs.test.ts` fails if the new version's layout can no longer be read.
- `src/index.ts` speaks Flow Launcher's v2 protocol: JSON-RPC 2.0 over stdio, `Content-Length` framed. Writing to stderr crashes the plugin, so it's silenced.
- `scripts/deploy-local.ps1` builds, replaces any installed FlowFaker in your Flow Launcher plugins folder, and restarts Flow Launcher:
  ```
  powershell -ExecutionPolicy Bypass -File .\scripts\deploy-local.ps1
  ```

### Releasing
Every push to `main` runs `.github/workflows/Publish Release.yml`. It builds, tests, and publishes `Flow.Launcher.Plugin.FakerJS.zip` to a release tagged `v<Version>` from `plugin.json`. **Bump `Version` in `plugin.json` before pushing** a change you want users to get; pushing without a bump updates the existing release. Keep the zip name unchanged, because the Flow Launcher plugin store downloads it by that name.

## Credits
All data generation comes from [Faker](https://fakerjs.dev) ([`@faker-js/faker`](https://github.com/faker-js/faker)), built and maintained by the Faker.js team and its contributors. The parameter hints and descriptions shown in the plugin are taken from Faker's own API documentation. Thank you for a wonderful library.

Faker is MIT-licensed. Its license ships with the plugin as `dist/FAKER-LICENSE.txt`.

FlowFaker is an independent project. It is **not affiliated with, endorsed by, or sponsored by** the Faker.js project. "Faker" is used only to describe the library the plugin is built on, and the plugin uses its own icon, not Faker's logo.

## License
MIT
